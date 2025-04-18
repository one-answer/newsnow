import type { NewsItem, SourceID, SourceResponse } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useAtom } from "jotai";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { sources } from "@shared/sources";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ofetch } from "ofetch";
import { useWindowSize } from "react-use";
import { OverlayScrollbar } from "../common/overlay-scrollbar";
import { refetchSourcesAtom } from "~/atoms";
import { useRelativeTime } from "~/hooks/useRelativeTime";
import { safeParseString } from "~/utils";
import { useFocusWith } from "~/hooks/useFocus";

export interface ItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  id: SourceID;
  /**
   * 是否显示透明度，拖动时原卡片的样式
   */
  isDragged?: boolean;
  handleListeners?: SyntheticListenerMap;
}

interface NewsCardProps {
  id: SourceID;
  handleListeners?: SyntheticListenerMap;
  inView: boolean;
}

export const CardWrapper = forwardRef<HTMLDivElement, ItemsProps>(({ id, isDragged, handleListeners, style, ...props }, dndRef) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  useImperativeHandle(dndRef, () => ref.current!);

  return (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col h-500px rounded-2xl p-4 cursor-default",
        "backdrop-blur-5 transition-opacity-300",
        isDragged && "op-50",
        `bg-${sources[id].color}-500 dark:bg-${sources[id].color} bg-op-40!`,
      )}
      style={{
        transformOrigin: "50% 50%",
        ...style,
      }}
      {...props}
    >
      <NewsCard id={id} inView={inView} handleListeners={handleListeners} />
    </div>
  );
});

const prevSourceItems: Partial<Record<SourceID, NewsItem[]>> = {};
function NewsCard({ id, inView, handleListeners }: NewsCardProps) {
  const [refetchSource, setRefetchSource] = useAtom(refetchSourcesAtom);
  const { data, isFetching, isPlaceholderData, isError } = useQuery({
    queryKey: [id, refetchSource[id]],
    queryFn: async ({ queryKey }) => {
      let response: SourceResponse;
      const [_id, _refetchTime] = queryKey as [SourceID, number];
      if (id === 'xiaohongshu') {
        document.cookie = "a1=192e0f41eb28rl2s06t7jprodoz8mem7zinadmvn730000385524";
        const xs = window.getXS();
        let url = `https://kaiwu.xxlb.org/xhs?xs=${xs["X-s"]}&xt=${xs["X-t"]}`;
        const res = await ofetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { data } = JSON.parse(res);
        const items: NewsItem[] = data.items.map((v: any) => ({
          id: v.id,
          title: v.note_card.display_title,
          url: `https://www.xiaohongshu.com/explore/${v.id}?xsec_token=${v.xsec_token}&xsec_source=pc_feed`,
          extra: {

          }
        }));
        response = {
          status: "success",
          id: id,
          updatedTime: xs["X-t"],
          items
        };
      } else {
        let url = `/api/s/${_id}`;
        const headers: Record<string, any> = {};
        if (Date.now() - _refetchTime < 1000) {
          url = `/api/s/${_id}?latest`;
          const jwt = safeParseString(localStorage.getItem("jwt"));
          if (jwt) headers.Authorization = `Bearer ${jwt}`;
        }
        response = await ofetch(url, {
          timeout: 10000,
          headers,
        });
      }

      try {
        if (response.items && sources[_id].type === "hottest" && prevSourceItems[_id]) {
          response.items.forEach((item, i) => {
            const o = prevSourceItems[_id]!.findIndex(k => k.id === item.id);
            item.extra = {
              ...item?.extra,
              diff: o === -1 ? undefined : o - i,
            };
          });
        }
      } catch (e) {
        console.log(e);
      }

      return response;
    },
    // refetch 时显示原有的数据
    placeholderData: (prev) => {
      if (prev?.id === id) {
        if (prev?.items && sources[id].type === "hottest") prevSourceItems[id] = prev.items;
        return prev;
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: inView,
  });

  const manualRefetch = useCallback(() => {
    setRefetchSource(prev => ({
      ...prev,
      [id]: Date.now(),
    }));
  }, [setRefetchSource, id]);

  const isFreshFetching = useMemo(() => isFetching && !isPlaceholderData, [isFetching, isPlaceholderData]);

  const { isFocused, toggleFocus } = useFocusWith(id);

  return (
    <>
      <div className={clsx("flex justify-between mx-2 mt-0 mb-2 items-center")}>
        <div className="flex gap-2 items-center">
          <a
            className={clsx("w-8 h-8 rounded-full bg-cover hover:animate-spin")}
            target="_blank"
            href={sources[id].home}
            title={sources[id].desc}
            style={{
              backgroundImage: `url(/icons/${id.split("-")[0]}.png)`,
            }}
          />
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span
                className="text-xl font-bold"
                title={sources[id].desc}
              >
                {sources[id].name}
              </span>
              {sources[id]?.title && <span className={clsx("text-sm", `color-${sources[id].color} bg-base op-80 bg-op-50! px-1 rounded`)}>{sources[id].title}</span>}
            </span>
            <span className="text-xs op-70"><UpdatedTime isError={isError} updatedTime={data?.updatedTime} /></span>
          </span>
        </div>
        <div className={clsx("flex gap-2 text-lg", `color-${sources[id].color}`)}>
          <button
            type="button"
            className={clsx("btn i-ph:arrow-counter-clockwise-duotone", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
            onClick={manualRefetch}
          />
          <button
            type="button"
            className={clsx("btn", isFocused ? "i-ph:star-fill" : "i-ph:star-duotone")}
            onClick={toggleFocus}
          />
          {handleListeners && (
            <button
              {...handleListeners}
              type="button"
              className={clsx("btn", "i-ph:dots-six-vertical-duotone", "cursor-grab")}
            />
          )}
        </div>
      </div>

      <OverlayScrollbar
        className={clsx([
          "h-full p-2 overflow-y-auto rounded-2xl bg-base bg-op-70!",
          isFreshFetching && `animate-pulse`,
          `sprinkle-${sources[id].color}`,
        ])}
        options={{
          overflow: { x: "hidden" },
        }}
        defer
      >
        <div className={clsx("transition-opacity-500", isFreshFetching && "op-20")}>
          {!!data?.items?.length && (sources[id].type === "hottest" ? <NewsListHot items={data.items} /> : <NewsListTimeLine items={data.items} />)}
        </div>
      </OverlayScrollbar>
    </>
  );
}

function UpdatedTime({ isError, updatedTime }: { updatedTime: any, isError: boolean; }) {
  const relativeTime = useRelativeTime(updatedTime ?? "");
  if (relativeTime) return `${relativeTime}更新`;
  if (isError) return "获取失败";
  return "加载中...";
}

function DiffNumber({ diff }: { diff: number; }) {
  const [shown, setShown] = useState(true);
  useEffect(() => {
    setShown(true);
    const timer = setTimeout(() => {
      setShown(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [setShown, diff]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 0.5, y: -7 }}
          exit={{ opacity: 0, y: -15 }}
          className={clsx("absolute left-0 text-xs", diff < 0 ? "text-green" : "text-red")}
        >
          {diff > 0 ? `+${diff}` : diff}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
function ExtraInfo({ item }: { item: NewsItem; }) {
  if (item?.extra?.info) {
    return <>{item.extra.info}</>;
  }
  if (item?.extra?.icon) {
    const { url, scale } = typeof item.extra.icon === "string" ? { url: item.extra.icon, scale: undefined } : item.extra.icon;
    return (
      <img
        src={url}
        style={{
          transform: `scale(${scale ?? 1})`,
        }}
        className="h-4 inline mt--1"
        onError={e => e.currentTarget.hidden = true}
      />
    );
  }
}

function NewsUpdatedTime({ date }: { date: string | number; }) {
  const relativeTime = useRelativeTime(date);
  return <>{relativeTime}</>;
}
function NewsListHot({ items }: { items: NewsItem[]; }) {
  const { width } = useWindowSize();
  return (
    <>
      {items?.map((item, i) => (
        <a
          href={width < 768 ? item.mobileUrl || item.url : item.url}
          target="_blank"
          key={item.id}
          title={item.extra?.hover}
          className={clsx(
            "flex gap-2 items-center mb-2 items-stretch relative",
            "hover:bg-neutral-400/10 rounded-md pr-1 visited:(text-neutral-400)",
          )}
        >
          <span className={clsx("bg-neutral-400/10 min-w-6 flex justify-center items-center rounded-md text-sm")}>
            {i + 1}
          </span>
          {!!item.extra?.diff && <DiffNumber diff={item.extra.diff} />}
          <span className="self-start line-height-none">
            <span className="mr-2 text-base">
              {item.title}
            </span>
            <span className="text-xs text-neutral-400/80 truncate align-middle">
              <ExtraInfo item={item} />
            </span>
          </span>
        </a>
      ))}
    </>
  );
}

function NewsListTimeLine({ items }: { items: NewsItem[]; }) {
  const { width } = useWindowSize();
  return (
    <ol className="border-s border-neutral-400/50 flex flex-col ml-1">
      {items?.map(item => (
        <li key={item.id} className="flex flex-col">
          <span className="flex items-center gap-1 text-neutral-400/50 ml--1px">
            <span className="">-</span>
            <span className="text-xs text-neutral-400/80">
              {(item.pubDate || item?.extra?.date) && <NewsUpdatedTime date={(item.pubDate || item?.extra?.date)!} />}
            </span>
            <span className="text-xs text-neutral-400/80">
              <ExtraInfo item={item} />
            </span>
          </span>
          <a
            className={clsx("ml-2 px-1 hover:bg-neutral-400/10 rounded-md visited:(text-neutral-400/80)")}
            href={width < 768 ? item.mobileUrl || item.url : item.url}
            title={item.extra?.hover}
            target="_blank"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare interface Window {
  getXS: () => {
    'X-s': string;
    'X-t': number;
  };
}
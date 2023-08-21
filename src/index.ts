import type { TransformResult } from "./type";
import { Plugin } from "./type";
import analizeEntry from "./analizeEntry";
import { refactorStorege } from "./refactor";
import enhanceVueComponent from "./enhanceVueComponent";
import { resolve } from "node:path";
import { displace } from "displace-comments";
import helper from "./helper";

export function offline(entry?: string): Plugin {
  let entryPath = "";
  let filtered = "";
  return {
    enforce:'pre',
    name: "vite:web-localstorage-plus-offline",
    transformIndexHtml(html) {
      const { html: newHtml, fullEntryPath } = analizeEntry(html, entry);
      entryPath = fullEntryPath;
      filtered = resolve(entryPath, "..");
      return newHtml;
    },
    transform(code, id): TransformResult {
      if (id.startsWith(filtered)) {
        try {
          code = displace(code);
        } catch (_) {}
      }
      let s = helper.str(code);
      if (id === entryPath) {
        refactorStorege(s);
      } else {
        s = enhanceVueComponent(s, id);
      }
      return {
        code: s.toString(),
        map: s.generateMap({ source: id, includeContent: true }),
      };
    },
  };
}

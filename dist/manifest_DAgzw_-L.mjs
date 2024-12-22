import './chunks/astro/server_Ds1vOKg4.mjs';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"","routes":[{"file":"file:///Users/eniopablo/Documents/code/astro/shot-by-enio/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/eniopablo/Documents/code/astro/shot-by-enio/src/pages/index.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/eniopablo/Documents/code/astro/shot-by-enio/src/pages/posts/[...slug].astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/posts/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/posts/[...slug]@_@astro":"pages/posts/_---slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_DAgzw_-L.mjs","/src/pages/posts/[...slug].astro":"chunks/_...slug__xrp7VEfj.mjs","/src/pages/index.astro":"chunks/index_RxEsCeR4.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/content/blog/old-money.mdx?astroContentCollectionEntry=true":"chunks/old-money_0FW0FySI.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/content/blog/old-money.mdx?astroPropagatedAssets":"chunks/old-money_DELU_fEg.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/content/blog/old-money.mdx":"chunks/old-money_n8gl_HMC.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/layouts/BlogPostLayout.astro":"chunks/BlogPostLayout_BWvxlxHS.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00431.jpg":"chunks/DSC00431_Db54pyLz.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00436.jpg":"chunks/DSC00436_BbRH9ZXj.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00446.jpg":"chunks/DSC00446_CbA7_hZ4.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00466.jpg":"chunks/DSC00466_Ct1MgYlV.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00503.jpg":"chunks/DSC00503_C7clglTx.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00512.jpg":"chunks/DSC00512_BG7gJ62j.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00522.jpg":"chunks/DSC00522_B_87rZxX.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00528.jpg":"chunks/DSC00528_DeltRNGU.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00534.jpg":"chunks/DSC00534_YJjGaxKW.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00540.jpg":"chunks/DSC00540_CqD_EQxE.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00542.jpg":"chunks/DSC00542_C9ujhQQU.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00546.jpg":"chunks/DSC00546_BuoN2J7U.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00549.jpg":"chunks/DSC00549_DlXYi41k.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00551.jpg":"chunks/DSC00551_DBg3QwID.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00554.jpg":"chunks/DSC00554_EldptUsZ.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00557.jpg":"chunks/DSC00557_CGYO3-k7.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00590.jpg":"chunks/DSC00590_R2c9s31V.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00602.jpg":"chunks/DSC00602_CjtjMS4t.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00608.jpg":"chunks/DSC00608_DFtzSqM3.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00620.jpg":"chunks/DSC00620_Epc9gZzk.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00632.jpg":"chunks/DSC00632_0OiuUQAL.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00635.jpg":"chunks/DSC00635_RxJWQAq8.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00659.jpg":"chunks/DSC00659_BTh8v9f5.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00686.jpg":"chunks/DSC00686_zPb7jYRM.mjs","/Users/eniopablo/Documents/code/astro/shot-by-enio/src/layouts/BlogPostLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BlogPostLayout.astro_astro_type_script_index_0_lang.DeBmqF1c.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///Users/eniopablo/Documents/code/astro/shot-by-enio/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false});

export { manifest };

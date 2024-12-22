import { a as createComponent, b as renderTemplate, m as maybeRenderHead, e as renderComponent, g as addAttribute, d as renderSlot, f as createAstro } from './astro/server_Ds1vOKg4.mjs';
import { format, parseISO } from 'date-fns';
import { $ as $$Icon } from './Icon_BNys9jVY.mjs';

const $$Astro = createAstro();
const $$BlogPostLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPostLayout;
  const { frontmatter } = Astro2.props;
  const date = new Date(frontmatter.publishedDate);
  return renderTemplate` ${maybeRenderHead()}<section class="mt-4"> <div class="w-full flex items-center justify-between"> <button class="goback flex items-center gap-1 text-sm"> ${renderComponent($$result, "Icon", $$Icon, { "name": "arrow-left", "size": 16 })}
go back
</button> <div class="flex items-center justify-center gap-3"> <button class="copy p-1.5 rounded-full hover:bg-gray-800"> ${renderComponent($$result, "Icon", $$Icon, { "name": "copy", "size": 18 })} </button> <button class="tweet p-1.5 rounded-full hover:bg-gray-800"> ${renderComponent($$result, "Icon", $$Icon, { "name": "x", "size": 18 })} </button> </div> </div> <div class="blog-header flex flex-col my-6"> <h1>${frontmatter.title}</h1> <time${addAttribute(date.toISOString(), "datetime")} class="text-nowrap text-sm"> ${format(
    parseISO(date.toISOString().substring(0, 10)),
    "MMMM dd, yyyy"
  )} </time> </div> ${renderSlot($$result, $$slots["default"])} </section>`;
}, "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/layouts/BlogPostLayout.astro", void 0);

export { $$BlogPostLayout as default };

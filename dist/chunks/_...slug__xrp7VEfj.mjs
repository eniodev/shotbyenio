/* empty css                         */
import { a as createComponent, b as renderTemplate, m as maybeRenderHead, d as renderSlot, e as renderComponent, f as createAstro } from './astro/server_Ds1vOKg4.mjs';
import { g as getCollection, $ as $$MainLayout } from './MainLayout_I8ZB83_A.mjs';

const $$Prose = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<style>
code {
  counter-reset: step;
  counter-increment: step 0;
}

code .line::before {
  content: counter(step);
  counter-increment: step;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(255,255,255, 30%);
}

code .line:last-child:empty::before {
  content: none;
  counter-increment: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>${maybeRenderHead()}<div class="prose w-full max-w-screen-md mx-auto text-sm text-gray-400
  prose-h2:text-gray-200 prose-h3:text-gray-200 prose-h1:text-gray-200 prose-h1:my-1
  prose-h1:text-2xl prose-h2:text-xl
  prose-a:text-blue-400 prose-p:text-justify  
  prose-pre:border
  prose-pre:border-gray-800 
  prose-pre:rounded-lg
  dark:prose-invert"> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/components/Prose.astro", void 0);

const $$Astro = createAstro();
async function getStaticPaths() {
  const blogEntries = await getCollection("blog");
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry } = Astro2.props;
  const { Content } = await entry.render();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Prose", $$Prose, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Content", Content, {})} ` })} ` })}`;
}, "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/pages/posts/[...slug].astro", void 0);

const $$file = "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/pages/posts/[...slug].astro";
const $$url = "/posts/[...slug]";

export { $$ as default, $$file as file, getStaticPaths, $$url as url };

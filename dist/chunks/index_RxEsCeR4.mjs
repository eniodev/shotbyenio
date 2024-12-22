/* empty css                         */
import { a as createComponent, b as renderTemplate, m as maybeRenderHead, g as addAttribute, e as renderComponent, f as createAstro } from './astro/server_Ds1vOKg4.mjs';
import { g as getCollection, $ as $$MainLayout } from './MainLayout_I8ZB83_A.mjs';
import { $ as $$Icon } from './Icon_BNys9jVY.mjs';
import { format, parseISO } from 'date-fns';

const $$Astro$1 = createAstro();
const $$Social = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Social;
  const { icon, prefix, username, domain } = Astro2.props;
  const link = `https://${icon}.${domain ? domain : "com"}/${prefix ? prefix : ""}${username}`;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(link, "href")} target="_blank" class="flex items-center justify-center border-[1px] border-gray-500 rounded-full bg-gray-100 bg-opacity-5 pl-2 pr-2.5 gap-1.5"> ${renderComponent($$result, "Icon", $$Icon, { "name": icon })} <span class="text-sm">@${username}</span> </a>`;
}, "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/components/Social.astro", void 0);

const $$Astro = createAstro();
const $$BlogPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const { slug, title, image, publishedDate } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li class="w-full"> <a${addAttribute(`/posts/${slug}`, "href")}> <img${addAttribute(image.url, "src")}${addAttribute(image.alt, "alt")} class="w-full"> <div class="w-full flex items-center justify-between py-2 gap-1"> <h1 class="text-lg font-bold text-gray-300"> ${title} </h1> <time${addAttribute(publishedDate.toISOString(), "datetime")} class="text-nowrap"> ${format(
    parseISO(publishedDate.toISOString().substring(0, 10)),
    "MMMM dd, yyyy"
  )} </time> </div> </a> </li>`;
}, "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/components/BlogPost.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const blogPosts = await getCollection("blog");
  return renderTemplate`<html> ${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Home" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="w-full flex flex-col items-center gap-6 text-sm"><!-- Professional Intro --><div class="mb-4 w-full flex flex-col items-start gap-4 leading-6"><img class="w-20 h-20 rounded-full row-reverse" src="avi.jpeg" alt="énio"><p class="">
Hello! My name is <span class="text-gray-300"> Énio Carlos </span>
and I am a <span class="text-gray-300">Photographer.</span><br>
I am also a <span class="text-gray-300">Software Engineer</span>
and yes, I built this website to share some of my work in hight quality because Instragram won't stop compressing my photos and make them look like a mess.
</p><p>
If you like what you see here you can always book a shoot, but for now just enjoy the collections below ↓
</p></div><!-- Social media --><div class="socials flex flex-col gap-4"><h2 class="w-full text-base text-gray-200">Connect</h2><di class="w-full flex justify-between items-center mb-4"><div class="flex items-center gap-2 flex-wrap">${renderComponent($$result2, "Social", $$Social, { "icon": "x", "username": "eniocarlos_" })}${renderComponent($$result2, "Social", $$Social, { "icon": "linkedin", "prefix": "in/", "username": "eniocarlos" })}${renderComponent($$result2, "Social", $$Social, { "icon": "github", "username": "eniodev" })}${renderComponent($$result2, "Social", $$Social, { "icon": "instagram", "username": "enio.carlos__" })}${renderComponent($$result2, "Social", $$Social, { "icon": "twitch", "username": "enio.carlos" })}${renderComponent($$result2, "Social", $$Social, { "icon": "youtube", "prefix": "@", "username": "enio.carlos" })}${renderComponent($$result2, "Social", $$Social, { "icon": "threads", "username": "enio.carlos__", "domain": "net" })}</div></di></div><div class="w-full posts flex flex-col gap-1.5"><h2 class="text-base text-gray-200">Collections</h2><ul class="flex flex-col items-center text-sm gap-20 mt-4">${blogPosts.map((blogPost) => renderTemplate`${renderComponent($$result2, "BlogPost", $$BlogPost, { "slug": blogPost.slug, "title": blogPost.data.title, "image": blogPost.data.image, "publishedDate": blogPost.data.publishedDate })}`)}</ul></div></div>` })}</html>`;
}, "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/pages/index.astro", void 0);

const $$file = "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };

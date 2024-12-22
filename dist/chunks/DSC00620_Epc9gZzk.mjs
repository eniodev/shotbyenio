const DSC00620 = new Proxy({"src":"/_astro/DSC00620.Cw6RpQnu.jpg","width":3957,"height":6000,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00620.jpg";
							}
							if (target[name] !== undefined) globalThis.astroAsset.referencedImages.add("/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00620.jpg");
							return target[name];
						}
					});

export { DSC00620 as default };

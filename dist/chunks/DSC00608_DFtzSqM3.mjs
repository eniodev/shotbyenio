const DSC00608 = new Proxy({"src":"/_astro/DSC00608.oFG8Nn7A.jpg","width":4000,"height":6000,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00608.jpg";
							}
							if (target[name] !== undefined) globalThis.astroAsset.referencedImages.add("/Users/eniopablo/Documents/code/astro/shot-by-enio/src/assets/albums/old-money/DSC00608.jpg");
							return target[name];
						}
					});

export { DSC00608 as default };

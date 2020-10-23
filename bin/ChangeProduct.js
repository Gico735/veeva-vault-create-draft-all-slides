#!/usr/bin/env node
const request = require("request");

let [server, idPres, token] = process.argv.slice(2);

if (server === undefined || idPres === undefined || token === undefined) {
  return console.log(`
  USING:
  veevadraft server idPres token

  server - vv-agency-ololo
  
  idPres - 12416
  
  token - sessionStorage[USER.authToken]`);
}
server = `https://${server}.veevavault.com/api/v19.3/`;
token = "Bearer " + token;

const getPresDataOptions = {
  method: "GET",
  url: `${server}objects/binders/${idPres}`,
  headers: { Authorization: token },
};

const updateSLides = (slide, product) => {
  const slideId = slide["properties"]["document_id__v"];
  const createDraftOptions = {
    method: "PUT",
    url: `${server}objects/documents/${slideId}`,
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      product__v: product,
    },
  };
  request(createDraftOptions, (err, res) => {
    if (err) {
      console.log("ERROR WHILE TRY UPDATE SLIDE");
      return new Error(err);
    }
    console.log(JSON.parse(res.body));
  });
};

const detralexKeys = ["_dx_", "_detralex_", "_detx_", "_apt_"];
const enarionKeys = ["_enerion"];
const detragelKeys = ["_dg_"];
const detralexProductId = "00P000000002W25";
const enarionProductId = "00P000000001S03";
const detragelProductId = "00P000000001S01";

request(getPresDataOptions, (err, res) => {
  if (err) {
    console.log("ERROR WHILE GET PRES INFO");
    return new Error(err);
  }
  const slideArr = JSON.parse(res.body)["binder"]["nodes"];
  const detralexSlidesArr = slideArr.filter(({ properties: { name__v } }) =>
    detralexKeys.some((key) => name__v.toLowerCase().includes(key))
  );
/*   const enarionSlidesArr = slideArr.filter(({ properties: { name__v } }) =>
    enarionKeys.some((key) => name__v.toLowerCase().includes(key))
  );
  const detragelSlidesArr = slideArr.filter(({ properties: { name__v } }) =>
    detragelKeys.some((key) => name__v.toLowerCase().includes(key))
  ); */
  for (slide of detralexSlidesArr) {
    updateSLides(slide, detralexProductId);
  }
/*   for (slide of enarionSlidesArr) {
    updateSLides(slide, enarionProductId);
  }
  for (slide of detragelSlidesArr) {
    updateSLides(slide, detragelProductId);
  } */
});

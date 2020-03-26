const request = require("request");

let [server, idPres, token] = process.argv.slice(2);

server = `https://${server}.veevavault.com/api/v19.3/`;
token = "Bearer " + token;

const getPresDataOptions = {
  method: "GET",
  url: `${server}objects/binders/${idPres}`,
  headers: { Authorization: token }
};

request(getPresDataOptions, (err, res) => {
  if (err) {
    console.log("ERROR WHILE GET PRES INFO");
    return new Error(err);
  }
  const slideArr = JSON.parse(res.body)["binder"]["nodes"];
  for (slide of slideArr) {
    const slideId = slide["properties"]["document_id__v"];
    const createDraftOptions = {
      method: "POST",
      url: `${server}objects/documents/${slideId}`,
      headers: { Authorization: token },
      formData: { createDraft: "latestContent" }
    };
    request(createDraftOptions, (err, res) => {
      if (err) {
        console.log("ERROR WHILE TRY UPDATE SLIDE");
        return new Error(err);
      }
      console.log("SUCCSES UPDATE SLIDE::" + slideId);
      console.log(res.body);
    });
  }
});
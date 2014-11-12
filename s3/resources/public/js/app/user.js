var $ = require("jquery")
var cookie = require("cookie-cutter")
var Rx = require("rx");

var authUser = cookie.get("authUser")

$("body").addClass(authUser || false ? "logged-in" : "logged-out")

function ajaxProfileReq() {
  // todo -- real login
  return Rx.Observable.of({"profile":{"goals":"","synopsis":"","resthr":53,"maxhr":185,"aerk":null,"anaerk":null},"email":"psalmi@iki.fi","avatarUrl":"http:\/\/www.gravatar.com\/avatar\/45fa0a2661eb4e7b7423d0e1177f98c8?d=monsterid&r=x","ownGroups":["Maraton alle 4h","Marrasputki","Puolikas","Suunnistajat"],"ownTags":["","kohti tukholmaa","alpit","ischgl","fustra","levi","pallas","pyh\u00e4kuru","stubaier","kisa","ty\u00f6matka","matsi","pitztal","tukholma","nuuksio classic -treenit","kohti jukolaa","jukola","pt","a-rata","koirataksi","nuuksio classic","marrasputki"],"sports":["Beach volley","Crossfit","Crosstrainer","Cyclocross","Golf","Hieronta","Hiihto","Jalkapallo","Jooga","Jumppa","Juoksu","J\u00e4\u00e4kiekko","Kahvakuula","Kamppailulaji","Kaukalopallo","Kickbike","Kiipeily","Koripallo","Kuntopiiri","Kuntopy\u00f6r\u00e4","Kuntosali","K\u00e4vely","Laskettelu","Lentopallo","Leuanveto","Luistelu","Luisteluhiihto","Lumikenk\u00e4ily","Lumilautailu","Maantiepy\u00f6r\u00e4ily","Maastojuoksu","Maastopy\u00f6r\u00e4ily","Melonta","Muu laji","Muu merkint\u00e4","Nyrkkeily","Perinteinen hiihto","Pilates","Potkukelkkailu","Pumppi","Py\u00f6r\u00e4ily","Ratsastus","Ringette","Rullahiihto","Rullaluistelu","Sairaus","Salibandy","Sauvak\u00e4vely","Seikkailu-urheilu","Sis\u00e4soutu","Soutu","Spinning","Squash","Sulkapallo","Suunnistus","S\u00e4hly","Tanssi","Tapahtuma","Telinevoimistelu","Tennis","Triathlon","Uinti","Vaellus","Venyttely","Vesijuoksu","Yleisurheilu"],"user":"plouh"})
}

exports.requiredAuths = function() {
  if (authUser == null) {
    document.location = "/login.html"
    return Rx.Observable.empty()
  }

  return Rx.Observable.of(authUser).flatMapLatest(ajaxProfileReq)
}

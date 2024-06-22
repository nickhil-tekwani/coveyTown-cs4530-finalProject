import order from "./localmp3s/order.mp3";
import showreel from "./localmp3s/showreel.mp3"
import price from "./localmp3s/price-of-freedom.mp3"
import Song from "../../classes/Song";

export default [
    new Song("Determinate", "Bridget Mendler", "https://mp3-file-uploader-test.s3.amazonaws.com/Bridget+Mendler+-+Determinate.mp3", "gerri"),
    new Song("Order", "ComaStudio", order, "alex"),
    new Song("Showreel", "QubeSounds", showreel, "tanya"),
    new Song("Price of Freedom", "ZakharValaha", price, "mickhil")
  ];

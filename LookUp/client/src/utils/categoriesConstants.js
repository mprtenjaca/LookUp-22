import { appliancesSub, audioSub, babySub, bikeSub, collectiblesSub, computersAndElectronicSub, fashionSub, gamesSub, homeSub, motorsSub, moviesAndBooksSub, phonesAndAccessioriesSub, sportsSub } from "./dropdownConstants";

export const categories = [
    { icon: "visibility", path: "all", heading: "All categories", sub: [{name: "Default"}]},
    { icon: "directions_car_filled", path: "cars", heading: "Cars", sub: [] },
    { icon: "moped", path: "motorbikes", heading: "Motorcycles", sub: [] },
    {
      icon: "sports_motorsports",
      path: "motors-and-accessories",
      heading: "Sport Accessories",
      sub: motorsSub,
    },
    { icon: "checkroom", path: "fashion-and-accessories", heading: "Fashion & accessories", sub: fashionSub },
    { icon: "maps_home_work", path: "real-estate", heading: "Real estate", sub: [] },
    { icon: "live_tv", path: "tv-audio-and-cameras", heading: "TV, audio & cameras", sub: audioSub },
    { icon: "phone_iphone", path: "cell-phones", heading: "Cell Phones & Accessories", sub: phonesAndAccessioriesSub },
    { icon: "computer", path: "electronics", heading: "Computers & Electronic", sub: computersAndElectronicSub },
    { icon: "sports_soccer", path: "sports-leisure", heading: "Sports & Leisure", sub: sportsSub },
    { icon: "directions_bike", path: "bikes", heading: "Bikes", sub: bikeSub },
    { icon: "sports_esports", path: "games-and-consoles", heading: "Games And Consoles", sub: gamesSub },
    { icon: "chair", path: "home-and-garden", heading: "Home & Garden", sub: homeSub },
    {
      icon: "local_laundry_service",
      path: "appliances",
      heading: "Appliances",
      sub: appliancesSub
    },
    { icon: "movie", path: "movies-books-music", heading: "Movies, Books & Music", sub: moviesAndBooksSub },
    { icon: "child_friendly", path: "baby-and-child", heading: "Baby & Child", sub: babySub },
    { icon: "brush", path: "collectibles-and-art", heading: "Collectibles & Art", sub: collectiblesSub },
    { icon: "pending", path: "other", heading: "Other", sub: [] },
  ];
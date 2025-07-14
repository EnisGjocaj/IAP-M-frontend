


import accountingImg from "../components/assets/images/accounting.jfif"
import agrobusinessImg from "../components/assets/images/agrobusiness.jfif"
import designImg from "../components/assets/images/design.jfif"
import codingImg from "../components/assets/images/coding.webp"



export const testimonialData = [
    {
      id: 1,
      rating: 4.9,
      description:
        "Ky institut me ka ndihmuar shume ne aftesimin tim profesional.",
      name: "Enis Gjocaj",
      profession: "Kontabilitet",
      img: "iap-m-logo.jpg",
    },
    {
      id: 2,
      rating: 5.0,
      description:
        "Instituti IAPM ka bere ndryshimin me te madh ne aftersimin tim si student.",
      name: "Enis Gjocaj",
      profession: "Programim",
      img: "iap-m-logo.jpg",
    },
    {
      id: 3,
      rating: 4.8,
      description:
        "Trajnimet nga instituti kane qene mjaft te nevojshme dhe te rendesishme per karieren time.",
      name: "Elona Berisha",
      profession: "Dizajn",
      img: "iap-m-logo.jpg",
    },
    {
      id: 4,
      rating: 4.7,
      description:
        "Behuni pjese edhe ju e trajnimeve te institutit nese deshironi te keni sukses.",
      name: "Valjona Molliqaj",
      profession: "Marketing",
      img: "iap-m-logo.jpg",
    },
  ];
  


  // data.jsx


export const courses = [
    {
      id: 1,
      title: "Kontabilitet",
      cover: accountingImg, // placeholder image
      instructor: "Instruktori 1",
      profileImg: "#", 
      lessons: 12,
      rating: 4.8,
      reviews: 20,
      price: "Free",
    },
    {
      id: 2,
      title: "Agrobiznesi",
      cover: agrobusinessImg, // placeholder image
      instructor: "Instruktori 2",
      profileImg: "https://via.placeholder.com/50x50.png?text=JS", // placeholder profile image
      lessons: 15,
      rating: 4.9,
      reviews: 50,
      price: "Free",
    },
    {
      id: 3,
      title: "Marketingu dhe dizajni",
      cover: designImg, // placeholder image
      instructor: "Instruktori 3",
      profileImg: "#", // placeholder profile image
      lessons: 10,
      rating: 4.7,
      reviews: 35,
      price: "Free",
    },
    {
      id: 4,
      title: "Programimi",
      cover: codingImg, // placeholder image
      instructor: "Instruktori 4",
      profileImg: "#", // placeholder profile image
      lessons: 20,
      rating: 4.85,
      reviews: 100,
      price: "Free",
    },
  ]
  
export interface Club {
  name: string;
}

export interface Domain {
  id: number;
  name: string;
  clubs: Club[];
}

export const domains: Domain[] = [
  {
    id: 1,
    name: "Fine Arts",
    clubs: [
      { name: "3-D Texture Art" },
      { name: "Handmade Jewellery" },
      { name: "Anime Portrait" },
      { name: "Miniature Painting" },
      { name: "Shoe and Latern Painting" },
      { name: "Design Thinking and Innovation" },
      { name: "Creative Painting" },
    ],
  },
  {
    id: 2,
    name: "Dance",
    clubs: [
      { name: "Classical Dance" },
      { name: "Contemporary: Hip Hop Dance" },
      { name: "Free Style & Folk Dance" },
      { name: "Punjabi Folks: Giddha" },
    ],
  },
  {
    id: 3,
    name: "Music",
    clubs: [{ name: "Instrumental: Rhythm; Percussion" }, { name: "Keyboard and Vocal" }],
  },
  {
    id: 4,
    name: "Dramatics",
    clubs: [{ name: "Theatre" }],
  },
  {
    id: 5,
    name: "Sports",
    clubs: [{ name: "Chess" }, { name: "Carrom" }, { name: "Table Tennis" }],
  },
  {
    id: 6,
    name: "Skill Development",
    clubs: [
      { name: "AR & IOT" },
      { name: "Food & Baking" },
      { name: "Health & Wellness" },
      { name: "Mass Media" },
    ],
  },
  {
    id: 7,
    name: "Literary",
    clubs: [
      { name: "Literary Club" },
      { name: "Comic Strip" },
      { name: "Namaste Germany!" },
      { name: "Namaste Japan!" },
      { name: "Namaste France!" },
    ],
  },
  {
    id: 8,
    name: "Academic",
    clubs: [
      { name: "Rube Goldberg" },
      { name: "Logic Legends" },
      { name: "Maths Manthan" },
      { name: "Youth Parliament" },
      { name: "Marketing & Sales" },
    ],
  },
];

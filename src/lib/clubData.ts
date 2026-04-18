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
      { name: "Punjabi Folk: Giddha – (Only for girls) " },
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
    clubs: [
      { name: "Chess" },
      { name: "Carrom" },
      { name: "Table Tennis (Basic proficiency needed) " },
    ],
  },
  {
    id: 6,
    name: "Skill Development",
    clubs: [
      { name: "Augmented Reality and Internet of things" },
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
      { name: "Namaste Germany! (Only for German language students)" },
      { name: "Namaste Japan! (Only for German language students)" },
      { name: "Namaste France!" },
    ],
  },
  {
    id: 8,
    name: "Academic",
    clubs: [
      { name: "Rube Goldberg" },
      { name: "Aptitude & Reasoning club" },
      { name: "Maths Manthan" },
      { name: "Youth Parliament" },
      { name: "Marketing & Sales" },
    ],
  },
];

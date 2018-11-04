import IndexPage from "views/IndexPage/IndexPage.jsx";
import Harmonograph from "views/Harmonograph.jsx";
import Inversion from "views/Inversion.jsx";
import CalabiYau from "views/CalabiYau.jsx";
import Riemann from "views/Riemann.jsx";
import Hata from "views/Hata.jsx";
import Complex from "views/Complex.jsx";
import Ca from "views/Ca.jsx";
import GameOfLife from "views/GameOfLife.jsx";
import Lsystem from "views/Lsystem.jsx";

var indexRoutes = [
  { path: "/harmonograph", name: "Harmonograph", component: Harmonograph },
  { path: "/inversion", name: "Inversion", component: Inversion },
  { path: "/calabiyau", name: "CalabiYau", component: CalabiYau },
  { path: "/riemann", name: "Riemann", component: Riemann },
  { path: "/hata", name: "Hata", component: Hata },
  { path: "/complex", name: "Complex", component: Complex },
  { path: "/ca", name: "Ca", component: Ca },
  { path: "/lifegame", name: "GameOfLife", component: GameOfLife },
  { path: "/lsystem", name: "Lsystem", component: Lsystem },
  { path: "/", name: "IndexPage", component: IndexPage },
];

export default indexRoutes;

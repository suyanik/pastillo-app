

import React from 'react';
import { Utensils, Pizza, Coffee, Wine } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const menuData = {
  tr: {
    title: "Dijital Menü",
    categories: [
      { name: "Antipasti", icon: <Utensils size={20}/>, items: ["Bruschetta Classica - 8.50€", "Carpaccio di Manzo - 14.50€", "Burrata & Pomodori - 12.00€"] },
      { name: "Pizza", icon: <Pizza size={20}/>, items: ["Margherita - 10.50€", "Diavola - 13.50€", "Quattro Formaggi - 14.00€"] },
      { name: "Pasta", icon: <Utensils size={20}/>, items: ["Carbonara - 12.50€", "Tagliatelle al Tartufo - 18.50€", "Lasagna Classica - 13.00€"] },
      { name: "İçecekler", icon: <Wine size={20}/>, items: ["Aperol Spritz - 8.50€", "Espresso - 2.50€", "Vino della Casa (0.2l) - 6.50€"] }
    ]
  },
  de: {
    title: "Speisekarte",
    categories: [
      { name: "Antipasti", icon: <Utensils size={20}/>, items: ["Bruschetta Classica - 8.50€", "Carpaccio di Manzo - 14.50€", "Burrata & Pomodori - 12.00€"] },
      { name: "Pizza", icon: <Pizza size={20}/>, items: ["Margherita - 10.50€", "Diavola - 13.50€", "Quattro Formaggi - 14.00€"] },
      { name: "Pasta", icon: <Utensils size={20}/>, items: ["Carbonara - 12.50€", "Tagliatelle al Tartufo - 18.50€", "Lasagna Classica - 13.00€"] },
      { name: "Getränke", icon: <Coffee size={20}/>, items: ["Aperol Spritz - 8.50€", "Espresso - 2.50€", "Hauswein (0.2l) - 6.50€"] }
    ]
  },
  en: {
    title: "Digital Menu",
    categories: [
      { name: "Antipasti", icon: <Utensils size={20}/>, items: ["Bruschetta Classica - 8.50€", "Carpaccio di Manzo - 14.50€", "Burrata & Pomodori - 12.00€"] },
      { name: "Pizza", icon: <Pizza size={20}/>, items: ["Margherita - 10.50€", "Diavola - 13.50€", "Quattro Formaggi - 14.00€"] },
      { name: "Pasta", icon: <Utensils size={20}/>, items: ["Carbonara - 12.50€", "Tagliatelle al Tartufo - 18.50€", "Lasagna Classica - 13.00€"] },
      { name: "Drinks", icon: <Wine size={20}/>, items: ["Aperol Spritz - 8.50€", "Espresso - 2.50€", "House Wine (0.2l) - 6.50€"] }
    ]
  },
  es: {
    title: "Menú Digital",
    categories: [
      { name: "Antipasti", icon: <Utensils size={20}/>, items: ["Bruschetta Classica - 8.50€", "Carpaccio di Manzo - 14.50€", "Burrata & Pomodori - 12.00€"] },
      { name: "Pizza", icon: <Pizza size={20}/>, items: ["Margherita - 10.50€", "Diavola - 13.50€", "Quattro Formaggi - 14.00€"] },
      { name: "Pasta", icon: <Utensils size={20}/>, items: ["Carbonara - 12.50€", "Tagliatelle al Tartufo - 18.50€", "Lasagna Classica - 13.00€"] },
      { name: "Bebidas", icon: <Wine size={20}/>, items: ["Aperol Spritz - 8.50€", "Espresso - 2.50€", "Vino de la Casa (0.2l) - 6.50€"] }
    ]
  }
};

const Menu: React.FC<Props> = ({ lang }) => {
  const data = menuData[lang];
  const subtitles = {
    tr: 'Pastillo lezzetlerini keşfedin.',
    de: 'Entdecken Sie unsere Spezialitäten.',
    en: 'Discover our specialties.',
    es: 'Descubre nuestras especialidades.'
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{data.title}</h2>
        <p className="text-white/60 font-medium text-lg mt-1">
          {subtitles[lang]}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.categories.map((cat, idx) => (
          <div key={idx} className="glass p-5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg text-primary group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{cat.name}</h3>
            </div>
            <ul className="space-y-3">
              {cat.items.map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <span className="text-white/80">{item.split(' - ')[0]}</span>
                  <span className="font-bold text-primary">{item.split(' - ')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

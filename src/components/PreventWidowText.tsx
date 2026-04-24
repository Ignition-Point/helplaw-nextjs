"use client";

import { useEffect } from "react";

export default function PreventWidowText() {
  useEffect(() => {
    document.querySelectorAll("p.font-normal,p.font-medium, h2.heading, h3.heading").forEach((el) => {
      const text = el.textContent?.trim();

      if (!text) return;

      const words = text.split(" ");

      if (words.length > 2) {
        words[words.length - 2] += "\u00A0" + words.pop();
        el.textContent = words.join(" ");
      }
    });
  }, []);

  return null;
}
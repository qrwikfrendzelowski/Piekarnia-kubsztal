Ostatnia aktualizacja: 2026-10-18 14:23 Europe/Berlin
Obecne zadanie: Naprawa działania aplikacji i integracja widoków, routingu oraz danych.
Ukończone: index.html montuje nawigację, treść i stopkę oraz ładuje design system; src/core/view-loader.js renderuje Home, Menu, Order i Contact z JSON produktów oraz danych piekarni, ładuje fragmenty nawigacji i stopki i inicjalizuje formularz; src/core/router.js mapuje ścieżki angielskie i polskie aliasy; src/core/app.js obsługuje nawigację SPA i błędy widoków; src/core/state.js otrzymuje listę produktów i koszyk; inicjalizatory formularza są uruchamiane po zamontowaniu widoku; dev-server.cjs obsługuje bezpośrednie wejście na trasy SPA.
Oczekujące (Pending): Ręczna weryfikacja wyglądu i interakcji w przeglądarce.
Blokady/Zależności (Dependencies): Brak. Widoki używają danych z src/data i istniejących komponentów oraz handlerów.

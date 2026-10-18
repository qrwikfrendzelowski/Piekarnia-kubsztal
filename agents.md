Piekarnia Kubulek - Architektura Agentów i Protokół Egzekucji
Ścisłe Granice Domenowe (Domain Boundaries)
Aby zapobiec konfliktom i blokowaniu plików (file locking), agenci NIE MOGĄ modyfikować plików poza przypisanymi katalogami:
Codex (Lead Engine): Core architecture, state management, router, app entry point.
Katalog: /src/core, /src/api, /index.html
Freebuff (UI/UX Engine): Architektura CSS, design system, struktury layoutu.
Katalog: /src/styles, /src/components/ui
Opencode (Data Engine): Modele danych, content JSON, mocki statyczne.
Katalog: /src/data, /src/utils
Copilot (Interactive Engine): Formularze, client-side validation, event handlery, dostępność (A11y).
Katalog: /src/components/interactive, /src/handlers

Protokół State Management
Każdy agent MUSI prowadzić aktywny log swojej pracy, aby zapewnić widoczność cross-agent.
Po zakończeniu zadania lub wyczerpaniu limitu tokenów, agent MUSI utworzyć lub nadpisać swój plik stanu w głównym katalogu:
current_state_codex.md
current_state_freebuff.md
current_state_opencode.md
current_state_copilot.md

Struktura Pliku Stanu
Każdy plik stanu musi mieć dokładnie taki format:
Ostatnia aktualizacja: [Timestamp]
Obecne zadanie: [Krótki opis]
Ukończone: [Lista utworzonych/zmodyfikowanych plików i wdrożonej logiki]
Oczekujące (Pending): [Kolejne kroki lub niedokończona logika]
Blokady/Zależności (Dependencies): [Wymagane funkcje lub dane od innych agentów]

Standardy Kodowania
Cały kod wewnątrz plików, zmienne, komentarze w kodzie i commit messages MUSZĄ być pisane w języku angielskim.
Tylko modular architecture. Wysoka wydajność, brak code bloat.
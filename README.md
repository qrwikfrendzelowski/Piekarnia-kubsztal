# Piekarnia Kubsztal

Prosta aplikacja webowa piekarni z widokami Home, menu wypieków, formularzem zamówienia i danymi kontaktowymi. Interfejs działa po stronie przeglądarki jako SPA, a treści produktów i piekarni są wczytywane z plików JSON.

## Wymagania

- Node.js 18 lub nowszy
- Przeglądarka internetowa z obsługą JavaScript modules

Projekt nie wymaga instalowania pakietów npm.

## Uruchomienie lokalne

W terminalu przejdź do folderu projektu i uruchom serwer:

```powershell
cd C:\VSCodeProjects\Piekarnia-kubsztal
node dev-server.cjs
```

Otwórz adres [http://127.0.0.1:8000](http://127.0.0.1:8000). Serwer pozostaje aktywny, dopóki działa terminal. Zatrzymaj go skrótem **Ctrl+C**.

Domyślnie serwer używa portu `8000`. Jeśli port jest zajęty, ustaw inny przed uruchomieniem:

```powershell
$env:PORT = 8001
node dev-server.cjs
```

Następnie otwórz [http://127.0.0.1:8001](http://127.0.0.1:8001).

## Odświeżanie po zmianach

Po zapisaniu zmian w plikach odśwież stronę klawiszem **F5**. **Ctrl+F5** wymusza pobranie plików bez użycia pamięci podręcznej. Zmiany w kodzie serwera wymagają jego ponownego uruchomienia: w terminalu naciśnij **Ctrl+C**, a potem ponownie wykonaj `node dev-server.cjs`.

## Widoki i adresy

| Widok | Adres kanoniczny | Obsługiwane aliasy |
| --- | --- | --- |
| Strona główna | `/` | `/home` |
| Menu | `/menu` | `/wypieki` |
| Zamówienie | `/order` | `/zamow` |
| Kontakt | `/contact` | `/kontakt`, `/o-nas` |

Serwer deweloperski przekazuje bezpośrednie wejścia na te ścieżki do `index.html`, a router wybiera właściwy widok.

## Struktura projektu

```text
index.html                  Główna strona i punkty montażowe aplikacji
dev-server.cjs              Lokalny serwer HTTP z obsługą tras SPA
src/
  api/client.js              Pobieranie plików JSON z src/data
  core/
    app.js                   Start aplikacji i obsługa kliknięć nawigacji
    router.js                Routing klienta i aliasy adresów
    state.js                 Store produktów i koszyka z subskrypcjami
    view-loader.js           Renderowanie widoków i ładowanie fragmentów UI
  components/
    ui/                       Fragmenty nawigacji, stopki i karty produktu
    interactive/              Szablon formularza zamówienia
  data/
    products.json             Katalog produktów
    bakery-info.json          Dane piekarni i godziny otwarcia
  handlers/                   Obsługa koszyka i walidacji formularza
  styles/                     Tokeny design systemu i główne style
  utils/                      Funkcje pomocnicze, w tym formatowanie cen i dat
```

## Przepływ danych

- `src/api/client.js` pobiera JSON z `src/data/`.
- `src/core/view-loader.js` renderuje widoki na podstawie katalogu produktów i danych piekarni.
- `src/core/state.js` przechowuje produkty i pozycje koszyka oraz powiadamia subskrybentów o zmianach.
- Formularz zamówienia waliduje dane i koszyk w przeglądarce. Obecnie nie wysyła zamówień do serwera ani nie zapisuje ich w bazie.

## Aktualizacja danych

Edytuj `src/data/products.json` lub `src/data/bakery-info.json`. Produkty powinny zachować strukturę obiektów używaną przez aplikację, w tym `id`, `title`, `description`, `price`, `category` i `ingredients`. Ceny są podawane w GBP. Po zapisaniu odśwież stronę.

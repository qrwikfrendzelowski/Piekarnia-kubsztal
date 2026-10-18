Ostatnia aktualizacja: 2026-10-18T14:17:48+02:00
Obecne zadanie: Weryfikacja poprawności struktury danych w src/data oraz zgodności eksportu z routerem i modułami ładowania widoków.
Ukończone:
- Walidacja strukturalna src/data/products.json (skrypt kontrolny, 0 błędów): top-level obiekt z kluczem "products" (tablica, 15 rekordów), unikalne kebab-case id, wymagane pola (id/title/description/price/category/ingredients/image) obecne we wszystkich rekordach, brak pól nadmiarowych, price = dodatnia liczba, category z zamkniętego zestawu (sourdough:3, artisan-bread:3, pastries:4, cakes:3, gluten-free:2 — wszystkie 5 kategorii obecne), ingredients = niepusta tablica niepustych stringów, image zgodny z konwencją /src/assets/images/products/*.svg. Pliki bez BOM, LF.
- Walidacja strukturalna src/data/bakery-info.json (0 błędów): name/adres (street,city,postalCode,country)/phone (format międzynarodowy)/email (regex), openingHours = dokładnie 7 dni w kolejności pon-niedz, format HH:MM, open < close, zamknięte dni bez pól open/close, history.founded (rok >= 1800), narrative >= 100 znaków, milestones[] z year >= founded i polem event.
- Zgodność eksportu z konsumentami (odczytane, nie modyfikowane):
  * src/api/client.js (Codex): fetchData("products") / fetchData("bakery-info") przechodzi walidację regex nazw [\w-]+ i resolves relative do src/data — zgodne.
  * src/core/state.js (Codex): setProducts() wymaga tablicy, więc loader musi wywołać setProducts(data.products) — mój eksport { "products": [...] } jest zgodny z oczekiwanym kluczem products.
  * src/handlers/formValidation.js i cartHandler.js (Copilot): nie konsumują pól JSON bezpośrednio (pracują na HTML) — brak konfliktu.
- Smoke test src/utils/formatters.js przez dynamic import: formatCurrency(4.8)="£4.80", formatPickupSlot("2026-10-18T09:30")="Sunday, 18 October 2026, 09:30", formatPickupDate("2026-10-25")="Sunday, 25 October 2026" — poprawne (walidacja dnia tygodnia potwierdzona).
- Skrypt walidacyjny: %TEMP%/opencode/validate-data.js (poza repo, nie wpływa na architekturę).
Oczekujące (Pending):
- src/components/pages/{home,menu,order,contact}.js — importowane przez src/core/view-loader.js, ale nie istnieją (domena Codex). Dopóki nie powstaną, router nie ma co renderować z products.json.
- Ceny w produktach są w GBP (wg specyfikacji), a placeholder src/components/ui/product-card.html (Freebuff) pokazuje "18,50 zł" — do decyzji zespołu: albo UI podmienia placeholder na £ przez formatCurrency(), albo docelowo product-card czyta price z JSON.
- Dostarczenie plików SVG pod /src/assets/images/products/*.svg (Freebuff) lub zastąpienie ścieżek innym placeholderem — obecnie wszystkie 15 ścieżek wskazuje na nieistniejące pliki.
Blokady/Zależności (Dependencies):
- Codex: loader widoków musi używać fetchData('products') i przekazać data.products do store.setProducts(); brak stron home/menu/order/contact blokuje render.
- Freebuff: spójność waluty (GBP vs zł w placeholderach) oraz assety SVG.
- Copilot: przy formularzu odbioru korzystać z formatPickupSlot/formatPickupDate z src/utils/formatters.js (zweryfikowane działające).

# Amdad roadmap

## Phase 0: MVP (this repository) ✅

- Bilingual (Arabic / English) landing page on GitHub Pages.
- Batch shelf-life calculator using a simplified Q10 temperature–time model and a "virtual sensor".
- FEFO batch allocation demo.
- Live WhatsApp message preview.
- Goal: explain the idea to distributors, judges and partners, and collect feedback.

## Phase 1: Pilot with 3–5 distributors and real sensors

- Low-cost, reusable temperature/humidity loggers travelling with each shipment (Jordan Valley routes via Hamra and Tayasir, and the Container / Wadi al-Nar route).
- Log every stage: harvest, loading, driving, checkpoint waits, delivery.
- Record ground truth: actual days until a batch was sold, discounted or returned, plus photos at loading and delivery.
- Recommendations sent manually over WhatsApp by the team; measure returns before vs. after.

## Phase 2: Trained ML model

- Use pilot data to calibrate per-product parameters (replacing sample values and the single Q10).
- Train a specialized model (e.g. gradient boosting) on trip features: temperature profile, delays, product, season, truck type, initial quality.
- Add photo-based quality grading at loading.
- Report prediction error (days) and uncertainty per batch.

## Phase 3: WhatsApp bot

- Automatic WhatsApp messages per batch: remaining life, category and recommended customer.
- Simple replies to confirm allocation or request trip details.
- Customer list management and FEFO allocation with capacity and route constraints.
- Monthly report for distributors: losses avoided, returns reduced.

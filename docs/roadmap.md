# Amdad roadmap

## Phase 0: MVP (this repository) ✅

- Bilingual (Arabic / English) landing page on GitHub Pages.
- Batch shelf-life calculator using a simplified Q10 temperature–time model and a "virtual sensor".
- FEFO batch allocation demo.
- Live WhatsApp message preview.
- Goal: explain the idea to distributors, judges and partners, and collect feedback.

## Phase 1: Pilot with 3–5 distributors and real sensors

- **2–3 reusable temperature loggers** rotated between trucks, **3–5 distributors**, **10–20 real trips** (Jordan Valley routes via Hamra and Tayasir to Hebron, Nablus and Ramallah, and the Container / Wadi al-Nar route).
- Log every stage: harvest, loading, driving, checkpoint waits, delivery.
- Record ground truth: actual days until a batch was sold, discounted or returned, plus photos at loading and delivery.
- Recommendations sent manually over WhatsApp by the team; measure returns before vs. after.

### Key assumptions to validate in the pilot

- Distributors are willing to pay a small monthly fee if the system reduces their losses.
- Drivers will carry the sensor and return it after each trip.
- 10–20 trips are enough to train a model accurate enough to sort batches into three groups: sell today, 2–3 days, or 4+ days.
- Distributors have customers with different storage times, so allocating by shelf life makes a real difference.
- Traders will follow the recommendations and report what happened to each batch, so the model keeps improving.

## Phase 2: Trained ML model

- Use pilot data to calibrate per-product parameters (replacing sample values and the single Q10).
- Train a specialized model (e.g. gradient boosting) on trip features: temperature, trip duration, checkpoint delays, product type, plus season, truck type and initial quality. A specialized model keeps prediction costs near zero, unlike a general language model.
- Add photo-based quality grading at loading.
- Report prediction error (days) and uncertainty per batch.
- Distributor dashboard: all batches with estimated remaining shelf life, trip details (temperature, delay hours, checkpoints passed) and recommended destinations.

## Phase 3: WhatsApp bot

- Automatic WhatsApp messages per batch: remaining life, category and recommended customer.
- Simple replies to confirm allocation or request trip details.
- Customer list management and FEFO allocation with capacity and route constraints.
- Monthly report for distributors: losses avoided, returns reduced.

# Imdad shelf-life model

> **All numbers on this page are sample values for demonstration.** The real product will be calibrated with sensor data from Palestinian trips.

The demo estimates how many days of shelf life a batch of fresh produce has left after a trip from the farm, through checkpoints, to the distributor. Everything runs in the browser: see [`js/model.js`](../js/model.js) and [`js/allocation.js`](../js/allocation.js).

## 1. Temperature–time model (Q10 rule)

Most quality loss in fresh produce (respiration, softening, decay) speeds up with temperature. A common rule of thumb in postharvest science is the **Q10 rule**: the rate of deterioration multiplies by a factor *Q10* for every +10 °C. For many fruits and vegetables Q10 is between 2 and 3.

| Constant | Value | Meaning |
|---|---|---|
| `T_REF` | 20 °C | Reference temperature at which base shelf life is defined |
| `Q10` | 2.5 | Spoilage speeds up 2.5× per +10 °C |

For each stage of the trip spent at temperature *T* for *h* hours:

```
rate(T)        = Q10 ^ ((T − T_REF) / 10)
consumed_days  = h × rate(T) / 24
```

So one hour at 20 °C consumes 1/24 of a day; one hour at 30 °C consumes 2.5/24; one hour at 40 °C consumes 6.25/24.

```
remaining_days = base_shelf_life_days × quality_factor − Σ consumed_days
```

The result is clamped at 0 and rounded to one decimal.

## 2. Sample values

### Base shelf life at 20 °C

| Product | Days |
|---|---|
| Tomato | 9 |
| Cucumber | 6 |
| Bell pepper | 8 |
| Grapes | 6 |
| Lettuce | 3 |
| Strawberry | 2 |

### Initial quality (stands in for a photo-based check)

| Quality | Factor |
|---|---|
| Excellent | 1.00 |
| Good | 0.85 |
| Fair | 0.65 |

### Checkpoint presets (default delay, editable)

| Checkpoint | Default delay |
|---|---|
| Hamra | 2 h |
| Tayasir | 1.5 h |
| Container / Wadi al-Nar | 1 h |
| Other | 1 h |

## 3. Virtual sensor: truck temperature estimate

The demo has no physical sensor, so the inside temperature is estimated from the outside temperature:

| Stage | Inside temperature |
|---|---|
| Before loading (harvest → loading) | outside |
| Driving, closed unrefrigerated | outside + 2 °C, **+1 °C** respiration heat = outside + 3 °C |
| Driving, open with cover | outside + 1 °C |
| Checkpoint, in the sun, closed | outside + 8 °C, **+1 °C** = outside + 9 °C |
| Checkpoint, in the sun, covered | outside + 5 °C |
| Checkpoint, in the shade | outside + 3 °C (closed: + 4 °C) |

The extra +1 °C for closed trucks represents respiration heat that cannot escape.

## 4. Outputs

| Remaining days | Category | Recommended customer |
|---|---|---|
| < 2 | 🔴 Sell today | Restaurants / central market |
| 2 to < 4 | 🟡 2–3 days | Small groceries |
| ≥ 4 | 🟢 4+ days | Supermarkets / distant governorates |

The calculator also shows a bar chart of days consumed per stage, and a **shade comparison**: the same trip recomputed as if the truck had waited in the shade.

## 5. Worked example

Tomato, good quality, 6 h before loading, 32 °C outside, 3 h driving, Hamra 2 h in the sun, closed truck:

| Stage | Temp | Rate | Hours | Consumed (days) |
|---|---|---|---|---|
| Before loading | 32 °C | 3.00 | 6 | 0.75 |
| Driving | 35 °C | 3.95 | 3 | 0.49 |
| Checkpoint (sun) | 41 °C | 6.85 | 2 | 0.57 |
| **Total** | | | | **1.82** |

Start: 9 × 0.85 = 7.65 days → remaining **5.8 days** → 🟢 supermarkets / distant governorates.
In the shade the checkpoint would be 36 °C (rate 4.33, 0.36 days) → **6.0 days**.

## 6. Allocation (FEFO)

See [`js/allocation.js`](../js/allocation.js).

1. Sort batches by remaining days, ascending (First Expired, First Out).
2. Assign each batch to the customer with the **longest** storage need it can still satisfy (`remaining_days ≥ need`).
3. If none fit: sell today at the central market / at a discount.

The "without allocation" baseline assumes batches are dispatched blindly in arrival order, rotating through the customer list, and counts how many land at a customer whose storage period is longer than the batch's remaining life.

## 7. Limitations

- **Sample values only.** Base shelf lives, Q10, temperature offsets and checkpoint delays are illustrative, not measured.
- A single Q10 for all products; in reality Q10 varies by product and temperature range, and chilling injury below ~10 °C (e.g. tomato, cucumber) is not modelled.
- The virtual sensor ignores humidity, solar load over time, ventilation, load density, ethylene and mechanical damage.
- Temperature is assumed constant within each stage.
- The quality dropdown replaces a real visual or photo-based inspection.
- Allocation ignores customer capacity, prices, distance and delivery routes.

The production version uses a specialized machine learning model trained on real sensor data: temperature, trip duration, checkpoint delays and product type. Wageningen research (Cappers et al., 2013) showed that this kind of damage can be predicted from temperature and time data. The production version replaces these assumptions with real sensor logs and a machine learning model trained on observed shelf life from Palestinian trips. See [roadmap.md](roadmap.md).

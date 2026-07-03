# TikTok: create a live ad, end to end

A worked walkthrough of going from nothing to a serving TikTok ad using this
server's tools. In Claude you'd just describe what you want and it calls these
in order — this shows the actual tool calls and arguments behind the scenes.

> Money note: the campaign/ad group/ad are built first; the ad only serves once
> the campaign is enabled in the final step. Review before that.

---

### 0. Confirm the connection and find your account
```jsonc
// tool: connection_status   -> { "ready": true }

// tool: list_ad_accounts
// -> [{ "advertiser_id": "7012345678901234567", "advertiser_name": "My Brand" }]
```
Either pass `advertiser_id` on every call, or set `TIKTOK_ADVERTISER_ID` so you
can omit it. The rest of this example omits it.

### 1. Discover targeting IDs
```jsonc
// tool: list_regions        // -> find the location_id for, say, the United States
// -> [{ "location_id": "6252001", "name": "United States", ... }]

// tool: list_interest_categories
// -> [{ "interest_category_id": "100", "name": "Beauty & Personal Care", ... }]

// tool: list_languages
// -> [{ "code": "en", "name": "English" }]
```

### 2. Create the campaign
```jsonc
// tool: create_campaign
{
  "campaign_name": "Summer Sale 2026",
  "objective_type": "TRAFFIC",
  "budget_mode": "BUDGET_MODE_DAY",
  "budget": 50
}
// -> { "campaign_id": "1799999999999999999" }
```

### 3. Create the ad group (budget + targeting + bidding)
```jsonc
// tool: create_adgroup
{
  "campaign_id": "1799999999999999999",
  "adgroup_name": "US / 18-34 / Beauty",
  "promotion_type": "WEBSITE",
  "placement_type": "PLACEMENT_TYPE_NORMAL",       // or PLACEMENT_TYPE_AUTOMATIC
  "optimization_goal": "CLICK",
  "billing_event": "CPC",
  "bid_type": "BID_TYPE_NO_BID",                    // lowest-cost bidding
  "budget_mode": "BUDGET_MODE_DAY",
  "budget": 20,
  "schedule_type": "SCHEDULE_FROM_NOW",
  "location_ids": ["6252001"],                      // United States (from step 1)
  "age_groups": ["AGE_18_24", "AGE_25_34"],
  "gender": "GENDER_UNLIMITED",
  "languages": ["en"],
  "interest_category_ids": ["100"],                 // Beauty & Personal Care
  "operating_systems": ["ANDROID", "IOS"],
  "extra": { "placements": ["PLACEMENT_TIKTOK"] }   // required with PLACEMENT_TYPE_NORMAL
}
// -> { "adgroup_id": "1800000000000000000" }
```

### 4. Upload the creative
```jsonc
// tool: upload_video        // (or upload_image for a static ad)
{ "video_url": "https://example.com/my-ad-video.mp4" }
// -> { "video_id": "v0201...", "...": "..." }

// You also need a cover image id for video ads; upload one:
// tool: upload_image
{ "image_url": "https://example.com/cover.jpg" }
// -> { "image_id": "ad-site-i18n-..." }
```

### 5. Find the identity the ad posts as
```jsonc
// tool: list_identities
// -> [{ "identity_id": "703...", "identity_type": "CUSTOMIZED_USER" }]
```

### 6. Create the ad (the creative that actually shows)
```jsonc
// tool: create_ad
{
  "adgroup_id": "1800000000000000000",
  "creatives": [
    {
      "ad_name": "Summer Sale - Video A",
      "identity_id": "703...",
      "identity_type": "CUSTOMIZED_USER",
      "ad_format": "SINGLE_VIDEO",
      "video_id": "v0201...",
      "image_ids": ["ad-site-i18n-..."],          // video cover
      "ad_text": "Up to 50% off — shop the summer sale 🌞",
      "call_to_action": "SHOP_NOW",
      "landing_page_url": "https://example.com/sale"
    }
  ]
}
// -> { "ad_ids": ["1801..."] }
```

### 7. Go live, then watch results
```jsonc
// tool: update_campaign_status
{ "campaign_ids": ["1799999999999999999"], "operation_status": "ENABLE" }

// tool: get_report
{ "start_date": "2026-06-01", "end_date": "2026-06-27",
  "data_level": "AUCTION_CAMPAIGN",
  "metrics": ["spend", "impressions", "clicks", "ctr", "cpc", "conversion"] }
```

---

#### Notes
- Exact required fields vary by **objective** and **optimization goal**. For
  conversion campaigns you'll typically add `pixel_id` and `optimization_event`
  via the ad group's `extra`. TikTok's API returns a clear error naming any
  missing field, which Claude can act on.
- `ad_format`, `call_to_action`, and identity rules differ by placement and
  account type — the creative object is passed through as-is, so anything
  TikTok supports works without code changes.

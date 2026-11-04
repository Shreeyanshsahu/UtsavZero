import json

with open("delhi_wards.geojson", encoding="utf-8") as f:
    data = json.load(f)

feature = data["features"][192]

print("\n--- FEATURE 192 ---")
print(json.dumps(feature, indent=2))

print("\n--- NEIGHBOURING FEATURES ---")

for i in range(188, 197):
    props = data["features"][i].get("properties", {})
    print(
        i,
        "Ward No:", props.get("Ward_No"),
        "Ward Name:", props.get("Ward_Name")
    )
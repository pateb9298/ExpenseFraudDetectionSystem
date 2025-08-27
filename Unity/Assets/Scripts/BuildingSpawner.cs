using UnityEngine;

public class BuildingSpawner : MonoBehaviour
{
    public GPSConverter gpsConverter;  // Drag your GPSManager here
    public GameObject buildingPrefab;  // Your cube prefab
    public Building[] buildings;       // List of buildings with lat/lon

    [System.Serializable]
    public class Building
    {
        public string name;
        public double latitude;
        public double longitude;
    }

    void Start()
    {
        foreach (var b in buildings)
        {
            Vector3 pos = gpsConverter.ConvertToUnityPosition(b.latitude, b.longitude, 0);
            GameObject marker = Instantiate(buildingPrefab, pos, Quaternion.identity);
            marker.name = b.name;  // Name it after the building
        }
    }
}

using System.Collections;
using UnityEngine;
using UnityEngine.XR.ARFoundation;

public class ARCompassNavigator : MonoBehaviour
{
    [Header("Target Building Coordinates")]
    public double targetLatitude = 43.531014;  // Hardcoded test building latitude
    public double targetLongitude = -80.226207; // Hardcoded test building longitude

    [Header("AR Arrow")]
    public GameObject arrow; // Assign your arrow prefab here

    private bool locationReady = false;

    void Start()
    {
        StartCoroutine(StartLocationService());
    }

    IEnumerator StartLocationService()
    {
        if (!Input.location.isEnabledByUser)
        {
            Debug.Log("Location services not enabled by user");
            yield break;
        }

        Input.location.Start(1f, 1f); // GPS start (accuracy, update distance)
        Input.compass.enabled = true;

        int maxWait = 20;
        while (Input.location.status == LocationServiceStatus.Initializing && maxWait > 0)
        {
            yield return new WaitForSeconds(1);
            maxWait--;
        }

        if (maxWait <= 0 || Input.location.status == LocationServiceStatus.Failed)
        {
            Debug.Log("Failed to initialize location service");
            yield break;
        }

        locationReady = true;
        Debug.Log("Location service started successfully");
    }

    void Update()
    {
        if (!locationReady || arrow == null) return;

        double userLat = Input.location.lastData.latitude;
        double userLon = Input.location.lastData.longitude;

        float heading = Input.compass.trueHeading;

        float bearing = CalculateBearing(userLat, userLon, targetLatitude, targetLongitude);

        // Rotate arrow to point to target
        arrow.transform.rotation = Quaternion.Euler(0, bearing - heading, 0);

        // Optional debug
        Debug.Log($"Lat: {userLat}, Lon: {userLon}, Heading: {heading}, Bearing: {bearing}");
    }

    float CalculateBearing(double lat1, double lon1, double lat2, double lon2)
    {
        double lat1Rad = Mathf.Deg2Rad * (float)lat1;
        double lat2Rad = Mathf.Deg2Rad * (float)lat2;
        double deltaLonRad = Mathf.Deg2Rad * (float)(lon2 - lon1);

        double y = Mathf.Sin((float)deltaLonRad) * Mathf.Cos((float)lat2Rad);
        double x = Mathf.Cos((float)lat1Rad) * Mathf.Sin((float)lat2Rad) -
                   Mathf.Sin((float)lat1Rad) * Mathf.Cos((float)lat2Rad) * Mathf.Cos((float)deltaLonRad);

        double bearingRad = Mathf.Atan2((float)y, (float)x);
        float bearingDeg = (float)(bearingRad * Mathf.Rad2Deg);
        return (bearingDeg + 360f) % 360f;
    }
}

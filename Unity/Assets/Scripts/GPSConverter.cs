using UnityEngine;

public class GPSConverter : MonoBehaviour
{
    // Reference point (latitude, longitude, altitude)
    public double referenceLatitude = 43.6532;   // Example: Toronto
    public double referenceLongitude = -79.3832;
    public double referenceAltitude = 0;

    // Earth radius in meters
    private const double EarthRadius = 6378137.0;

    /// <summary>
    /// Converts GPS coordinates (lat, lon, alt) into a Unity Vector3 position relative to the reference point.
    /// </summary>
    public Vector3 ConvertToUnityPosition(double latitude, double longitude, double altitude = 0)
    {
        // Differences in radians
        double latRad = Mathf.Deg2Rad * (latitude - referenceLatitude);
        double lonRad = Mathf.Deg2Rad * (longitude - referenceLongitude);

        // Convert degrees to meters
        double x = lonRad * EarthRadius * Mathf.Cos((float)(referenceLatitude * Mathf.Deg2Rad));
        double z = latRad * EarthRadius;
        double y = altitude - referenceAltitude;

        // Cast doubles to floats for Vector3
        return new Vector3((float)x, (float)y, (float)z);
    }

    // Example usage for testing
    void Start()
    {
        Vector3 testPos = ConvertToUnityPosition(43.654, -79.38); // nearby coordinate
        Debug.Log("Converted Unity Position: " + testPos);
    }
}

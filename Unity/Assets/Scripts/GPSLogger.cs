using UnityEngine;
using System.Collections;

public class GPSLogger : MonoBehaviour
{
    IEnumerator Start()
    {
        // Check if user has location service enabled
        if (!Input.location.isEnabledByUser)
        {
            Debug.Log("GPS not enabled by user");
            yield break;
        }

        // Start service before querying location
        Input.location.Start();

        // Wait until service initializes
        int maxWait = 20;
        while (Input.location.status == LocationServiceStatus.Initializing && maxWait > 0)
        {
            yield return new WaitForSeconds(1);
            maxWait--;
        }

        // Service didn’t initialize in time
        if (maxWait < 1)
        {
            Debug.Log("Timed out");
            yield break;
        }

        // Connection failed
        if (Input.location.status == LocationServiceStatus.Failed)
        {
            Debug.Log("Unable to determine device location");
            yield break;
        }
        else
        {
            // Access granted and location value could be retrieved
            Debug.Log("Lat: " + Input.location.lastData.latitude +
                      " Long: " + Input.location.lastData.longitude +
                      " Alt: " + Input.location.lastData.altitude +
                      " H-Acc: " + Input.location.lastData.horizontalAccuracy +
                      " Time: " + Input.location.lastData.timestamp);
        }

        // Start compass too
        Input.compass.enabled = true;
    }

    void Update()
    {
        if (Input.compass.enabled)
        {
            Debug.Log("Heading: " + Input.compass.trueHeading);
        }
    }
}

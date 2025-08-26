using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking; // For web requests

[System.Serializable]
public class Building
{
    public string name;
    public string code;
    public float latitude;
    public float longitude;
}

[System.Serializable]
public class BuildingList
{
    public Building[] buildings;
}

public class BackendManager : MonoBehaviour
{
    public string backendUrl = "http://localhost:5000/building"; // Your Node.js URL

    void Start()
    {
        StartCoroutine(GetBuildings());
    }

    IEnumerator GetBuildings()
    {
        UnityWebRequest www = UnityWebRequest.Get(backendUrl);
        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Error fetching buildings: " + www.error);
        }
        else
        {
            string json = www.downloadHandler.text;
            Debug.Log("Received JSON: " + json);

            // Optional: parse JSON into objects
            Building[] buildings = JsonHelper.FromJson<Building>(json);
            foreach (var b in buildings)
            {
                Debug.Log("Building: " + b.name + " at (" + b.latitude + "," + b.longitude + ")");
            }
        }
    }
}

// Helper class to parse JSON arrays
public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        string newJson = "{ \"buildings\": " + json + "}";
        BuildingList wrapper = JsonUtility.FromJson<BuildingList>(newJson);
        return wrapper.buildings as T[];
    }
}

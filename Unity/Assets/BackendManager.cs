using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using UnityEngine;
using UnityEngine.Networking; //For making web requests to your backend 

public class BackendManager: MonoBehaviour
{
    public string backendUrl = "https://localhost:5000/building";

    private void Start()
    {
        StartCoroutine(GetBuildings()); //Start fetching buildings when scene starts
    }

}

//allows Unity to convert JSON into this class
[System.Serializable]

//Each building has name, code, latitude, and longitude
public class Building
{
    public string name;
    public string code;
    public float latitude;
    public float longitude;
}

IEnumerator GetBuildings()
{
    UnityWebRequest www = UnityWebRequest.Get(backendUrl); //Make GET request
    yield return www.SendWebRequest();

    if (www.result != UnityWebRequest.Result.Success)
    {
        Debug.LogError("Error fetching buildings: " + www.error);
    }
    else
    {
        string json = www.downloadHandler.text; //Get JSON response
        Debug.Log("Recieved JSON: " + json);
        //For now, just log it. We will parse it next.
    }
}


[System.Serializable]
public class BuildingList
{
    public Building[] buildings;
}

public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        string newJson = "{ \"buildings\": " + json + "}";
        BuildingList wrapper = JsonUtility.FromJson<BuildingList>(newJson);
        return wrapper.buildings as T[];
    }
}

Building[] buildings = JsonHelper.FromJson<Building>(json);
foreach (var b in buildings)
{
    Debug.Log("Building: " + b.name + " at (" + b.latitude + "," + b.longitude + ")");
}

const BASEURL: any = import.meta.env.VITE_BACKENDURL;

export async function createSession(token: string, title: string ="") {
    const url: string = `${BASEURL}/session`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
    const body = {
        title: title,
    }

    const respone = await fetch(url, {method: "POST", headers: headers, body: JSON.stringify(body)});
    if (respone.status === 200) {
        return await respone.json();
    }
    if (respone.status === 401) {
        return 401
    }
    return 500;
}

export async function endSession(token: string, id: string) {
    const url: string = `${BASEURL}/session/end/${id}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
    const response = await fetch(url, {method: "put", headers: headers});
    if (response.status === 200) {
        return await response.json();
    }
    if (response.status === 401) {
        return 401
    }
    return 500;
}

export async function openSession(token: string) {
    const url: string = `${BASEURL}/session/opensession`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
    const response = await fetch(url, {method: "get", headers: headers});
    if (response.status === 200) {
        return await response.json();
    }
    if (response.status === 401) {
        return 401
    }
    return 500;
}

export async function getSessions(token: string) {
    const url: string = `${BASEURL}/session/sessions`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
    const response = await fetch(url, {method: "get", headers: headers});
    if (response.status === 200) {
        return await response.json();
    }
    if (response.status === 401) {
        return 401
    }
    return 500;

}
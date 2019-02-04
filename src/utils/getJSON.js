function makeRequest(resolve, reject) {
    var request = new XMLHttpRequest()
    request.open('GET', this, true)

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                var data = JSON.parse(this.responseText)
                resolve(data)
            } else {
                reject(this.status)
            }
        }
    }

    request.send()
    request = null
}

export default function getJSON(url) {
    return new Promise(makeRequest.bind(url))
}

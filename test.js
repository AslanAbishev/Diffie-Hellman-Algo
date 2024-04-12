const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
  
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
  
    return true;
  }
  
  function generateGenerator(p) {
    let tested = new Set();
    
    for (let g = 2; g < p; g++) {
      if (tested.has(g)) continue;
      let isGenerator = true;
  
      for (let i = 1; i < p - 1; i++) {
        tested.add(g);
        if (BigInt(g) ** BigInt(i) % BigInt(p) === 1n) {
          isGenerator = false;
          break;
        }
      }
  
      
      if (isGenerator) return g;
    }
  
    throw new Error("Failed to find a generator for the given prime.");
  }
  
  function diffieHellman(p, g, a) {
    if (!isPrime(p)) {
      throw new Error("p must be a prime number.");
    }
  
    if (a <= 1 || a >= p - 1) {
      throw new Error("Private key must be within the range (1, p-1).");
    }
  
    const A = BigInt(g) ** BigInt(a) % BigInt(p);
  
    return {
      publicKey: A,
      getSharedSecret: function(B) {
        if (B <= 1 || B >= p - 1) {
          throw new Error("Received public key is invalid.");
        }
  
        const S = BigInt(B) ** BigInt(a) % BigInt(p);
        return S;
      }
    };
  }
  
  readline.question("Enter a prime number (p): ", (pInput) => {
    const p = parseInt(pInput);
  
    if (!isPrime(p)) {
      console.error("Invalid input. Please enter a prime number.");
      readline.close();
      return;
    }
  
    const g = generateGenerator(p);
  
    readline.question("Enter Alice's private key (a): ", (aInput) => {
      const a = parseInt(aInput);
      const alice = diffieHellman(p, g, a);
  
      readline.question("Enter Bob's private key (b): ", (bInput) => {
        const b = parseInt(bInput);
        const bob = diffieHellman(p, g, b);
  
        const aliceSharedSecret = alice.getSharedSecret(bob.publicKey);
        const bobSharedSecret = bob.getSharedSecret(alice.publicKey);
        console.log("g: ",g )
        console.log("Alice's shared secret:", aliceSharedSecret);
        console.log("Bob's shared secret:", bobSharedSecret);
  
        readline.close();
      });
    });
  });
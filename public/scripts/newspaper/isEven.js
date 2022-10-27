function ifEven(n) {
    if (n == 0) {
        return true;
    } else if(n == 1) {
        return false;
    }
    return ifEven(n-2);
}

console.log(ifEven(1));
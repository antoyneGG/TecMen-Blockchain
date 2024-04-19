from sys  import stdin
def main():
    linea = stdin.readline()
    while(linea != ""):
        jug = linea = list(map(int, linea.split()))
        corrA = jug[0]
        corrB = jug[1]
        ans = lapSearch(corrA, corrB, 2, corrB)
        print(ans)
        linea = stdin.readline()


def lapSearch(corrA, corrB, low, high):
    ans = 0
    if(high - low == 1):
        ans = high
    elif(((2 * corrB) - (2 * corrA)) >= corrB):
        ans = 2
    else:
        mid = (low + high) // 2
        if(((mid * corrB) - (mid * corrA)) == corrB):
            ans = mid
        elif(((mid * corrB) - (mid * corrA)) > corrB):
            ans = lapSearch(corrA, corrB, low, mid)
        else:
            ans = lapSearch(corrA, corrB, mid, high)
    return ans

main()
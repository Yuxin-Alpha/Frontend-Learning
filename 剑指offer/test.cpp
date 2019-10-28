#include <iostream>
#include<string>
#include<vector>
using namespace std;

int main() {
  vector<int> num;
  for(int i = 0; i < 10; i++) {
    num.push_back(i);
    cout << num[i] << ",";
  }
  cout << "\n";
  return 0;
}
#include <iostream>
#include<string>
#include<vector>
using namespace std;

int main() {
  vector <string>num(10);
  num.push_back("ha");
  num.push_back("ea");
  num.push_back("ld");
  num.push_back("ld");
  num.push_back("o");
  cout << num[2];
  cout << "\n";
  return 0;
}
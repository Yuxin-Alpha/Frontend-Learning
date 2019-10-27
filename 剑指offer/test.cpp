#include <iostream>
#include<string>
using std::cin;
using std::cout;
using std::endl;
using std::string;

int main() {
  string str = "some strings";
  for (auto c : str) {
    cout << c << endl; 
  }
  return 0;
}
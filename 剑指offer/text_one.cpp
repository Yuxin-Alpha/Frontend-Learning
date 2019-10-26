#include <iostream>

int main() {
  std::cout << "今天开始写cpp" << std::endl;
  int num_one = 0;
  int num_two = 0;
  std::cin >> num_one >> num_two;
  std::cout << num_one << "加" << num_two << "的值是：" << num_one + num_two << std::endl;
  return 0;
}
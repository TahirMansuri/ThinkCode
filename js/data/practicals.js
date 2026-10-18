// =============================================================================
// ThinkCode Academic Practicals Hub — Curated University Lab Dataset
// Covers official curricula for BCA, BSc (CS/IT), and B.Tech / BE Engineering
// =============================================================================

const PRACTICALS_DATA = [
  // ---------------------------------------------------------------------------
  // 1. LINEAR SEARCH
  // ---------------------------------------------------------------------------
  {
    id: "linear-search",
    title: "Linear Search in Array",
    category: "Searching",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement the Linear Search algorithm to find the location of a target element in a given 1D array.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(n)",
      space: "O(1)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "linear",
      visualizerCat: "searching"
    },
    sampleIO: {
      input: "Array: [12, 45, 67, 23, 89, 34]\nSearch Element: 23",
      output: "Element 23 found at index 3 (Position 4)."
    },
    viva: [
      {
        q: "What is the best-case time complexity of Linear Search?",
        a: "O(1), when the search element is present at the first index of the array."
      },
      {
        q: "When should you prefer Linear Search over Binary Search?",
        a: "When the array is unsorted, or when the dataset is very small where sorting first would add unnecessary overhead."
      },
      {
        q: "Can Linear Search work on linked lists?",
        a: "Yes. Linear search works seamlessly on linked lists by traversing nodes sequentially from head to null."
      }
    ],
    code: {
      c: `#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Target found at index i
        }
    }
    return -1; // Target not found
}

int main() {
    int arr[] = {12, 45, 67, 23, 89, 34};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 23;

    printf("Array elements: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\nSearching for: %d\\n", target);

    int result = linearSearch(arr, n, target);
    if (result != -1) {
        printf("Element %d found at index %d (Position %d)\\n", target, result, result + 1);
    } else {
        printf("Element %d not found in array\\n", target);
    }

    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Return index
        }
    }
    return -1; // Not found
}

int main() {
    vector<int> arr = {12, 45, 67, 23, 89, 34};
    int target = 23;

    cout << "Array elements: ";
    for (int x : arr) cout << x << " ";
    cout << "\\nSearching for: " << target << endl;

    int idx = linearSearch(arr, target);
    if (idx != -1) {
        cout << "Element " << target << " found at index " << idx << " (Position " << (idx + 1) << ")" << endl;
    } else {
        cout << "Element " << target << " not found." << endl;
    }

    return 0;
}`,
      java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i; // Found
            }
        }
        return -1; // Not found
    }

    public static void main(String[] args) {
        int[] arr = {12, 45, 67, 23, 89, 34};
        int target = 23;

        System.out.print("Array elements: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println("\\nSearching for: " + target);

        int result = linearSearch(arr, target);
        if (result != -1) {
            System.out.println("Element " + target + " found at index " + result + " (Position " + (result + 1) + ")");
        } else {
            System.out.println("Element " + target + " not found.");
        }
    }
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Driver Code
arr = [12, 45, 67, 23, 89, 34]
target = 23

print("Array elements:", arr)
print("Searching for:", target)

idx = linear_search(arr, target)
if idx != -1:
    print(f"Element {target} found at index {idx} (Position {idx + 1})")
else:
    print(f"Element {target} not found in array")`
    }
  },

  // ---------------------------------------------------------------------------
  // 2. BINARY SEARCH
  // ---------------------------------------------------------------------------
  {
    id: "binary-search",
    title: "Binary Search in Sorted Array",
    category: "Searching",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement Binary Search using divide-and-conquer on a sorted 1D array.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(log n)",
      space: "O(1)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "binary",
      visualizerCat: "searching"
    },
    sampleIO: {
      input: "Sorted Array: [11, 22, 33, 44, 55, 66, 77, 88]\nSearch Target: 55",
      output: "Element 55 found at index 4 (Position 5)."
    },
    viva: [
      {
        q: "What is the primary prerequisite for Binary Search?",
        a: "The elements in the array must already be sorted in ascending or descending order."
      },
      {
        q: "Why do we calculate mid as 'low + (high - low) / 2' instead of '(low + high) / 2'?",
        a: "To prevent integer overflow in languages like C, C++, and Java when (low + high) exceeds the maximum 32-bit integer limit."
      },
      {
        q: "What is the worst-case number of comparisons for an array of size n?",
        a: "floor(log2(n)) + 1 comparisons."
      }
    ],
    code: {
      c: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            low = mid + 1; // Search right half
        else
            high = mid - 1; // Search left half
    }
    return -1; // Not found
}

int main() {
    int arr[] = {11, 22, 33, 44, 55, 66, 77, 88};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 55;

    printf("Sorted Array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\nSearching for: %d\\n", target);

    int result = binarySearch(arr, n, target);
    if (result != -1) {
        printf("Element %d found at index %d (Position %d)\\n", target, result, result + 1);
    } else {
        printf("Element %d not found\\n", target);
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {11, 22, 33, 44, 55, 66, 77, 88};
    int target = 55;

    cout << "Sorted Array: ";
    for (int x : arr) cout << x << " ";
    cout << "\\nTarget: " << target << endl;

    int idx = binarySearch(arr, target);
    if (idx != -1) {
        cout << "Element " << target << " found at index " << idx << " (Position " << (idx + 1) << ")" << endl;
    } else {
        cout << "Element not found" << endl;
    }
    return 0;
}`,
      java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {11, 22, 33, 44, 55, 66, 77, 88};
        int target = 55;

        System.out.print("Sorted Array: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println("\\nTarget: " + target);

        int idx = binarySearch(arr, target);
        if (idx != -1) {
            System.out.println("Element " + target + " found at index " + idx + " (Position " + (idx + 1) + ")");
        } else {
            System.out.println("Element not found.");
        }
    }
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Driver Code
arr = [11, 22, 33, 44, 55, 66, 77, 88]
target = 55

print("Sorted Array:", arr)
print("Target:", target)

idx = binary_search(arr, target)
if idx != -1:
    print(f"Element {target} found at index {idx} (Position {idx + 1})")
else:
    print(f"Element {target} not found in array")`
    }
  },

  // ---------------------------------------------------------------------------
  // 3. BUBBLE SORT
  // ---------------------------------------------------------------------------
  {
    id: "bubble-sort",
    title: "Bubble Sort Algorithm",
    category: "Sorting",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To sort an unsorted array of integers in ascending order using the optimized Bubble Sort technique.",
    complexity: {
      timeBest: "O(n)",
      timeWorst: "O(n²)",
      space: "O(1)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "bubble",
      visualizerCat: "sorting"
    },
    sampleIO: {
      input: "Unsorted: [64, 34, 25, 12, 22, 11, 90]",
      output: "Sorted Array: [11, 12, 22, 25, 34, 64, 90]"
    },
    viva: [
      {
        q: "Why is it named 'Bubble Sort'?",
        a: "Because with each complete pass, the largest remaining element bubbles up to its correct final position at the end of the array."
      },
      {
        q: "How can Bubble Sort achieve O(n) best-case time complexity?",
        a: "By introducing a boolean swapped flag. If no adjacent elements are swapped in the first pass, the array is already sorted and we can break immediately."
      },
      {
        q: "Is Bubble Sort a stable sorting algorithm?",
        a: "Yes, because it only swaps adjacent elements when the left is strictly greater than the right (arr[j] > arr[j+1]), preserving original relative order of equal elements."
      }
    ],
    code: {
      c: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0; // Optimization flag
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break; // Array already sorted
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    bubbleSort(arr, n);

    printf("Sorted:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};

    cout << "Original: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    bubbleSort(arr);

    cout << "Sorted:   ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};

        System.out.print("Original: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();

        bubbleSort(arr);

        System.out.print("Sorted:   ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break

# Driver Code
arr = [64, 34, 25, 12, 22, 11, 90]
print("Original:", arr)
bubble_sort(arr)
print("Sorted:  ", arr)`
    }
  },

  // ---------------------------------------------------------------------------
  // 4. SELECTION SORT
  // ---------------------------------------------------------------------------
  {
    id: "selection-sort",
    title: "Selection Sort Algorithm",
    category: "Sorting",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To sort an array by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.",
    complexity: {
      timeBest: "O(n²)",
      timeWorst: "O(n²)",
      space: "O(1)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "selection",
      visualizerCat: "sorting"
    },
    sampleIO: {
      input: "Unsorted: [29, 10, 14, 37, 13]",
      output: "Sorted Array: [10, 13, 14, 29, 37]"
    },
    viva: [
      {
        q: "What is the maximum number of swaps in Selection Sort?",
        a: "At most O(n) swaps, which makes Selection Sort ideal when memory writes are particularly expensive."
      },
      {
        q: "Why is Selection Sort's best-case time complexity O(n²)?",
        a: "Because it always scans the entire remaining unsorted subarray to find the minimum, even if the array is already sorted."
      },
      {
        q: "Is standard Selection Sort stable?",
        a: "No, long-distance swaps can reorder identical elements, making standard array-based Selection Sort unstable."
      }
    ],
    code: {
      c: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

int main() {
    int arr[] = {29, 10, 14, 37, 13};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    selectionSort(arr, n);

    printf("Sorted:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}

int main() {
    vector<int> arr = {29, 10, 14, 37, 13};

    cout << "Original: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    selectionSort(arr);

    cout << "Sorted:   ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {29, 10, 14, 37, 13};

        System.out.print("Original: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();

        selectionSort(arr);

        System.out.print("Sorted:   ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Driver Code
arr = [29, 10, 14, 37, 13]
print("Original:", arr)
selection_sort(arr)
print("Sorted:  ", arr)`
    }
  },

  // ---------------------------------------------------------------------------
  // 5. INSERTION SORT
  // ---------------------------------------------------------------------------
  {
    id: "insertion-sort",
    title: "Insertion Sort Algorithm",
    category: "Sorting",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To sort an array by incrementally inserting each unsorted element into its proper position among the previously sorted elements.",
    complexity: {
      timeBest: "O(n)",
      timeWorst: "O(n²)",
      space: "O(1)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "insertion",
      visualizerCat: "sorting"
    },
    sampleIO: {
      input: "Unsorted: [12, 11, 13, 5, 6]",
      output: "Sorted Array: [5, 6, 11, 12, 13]"
    },
    viva: [
      {
        q: "How does Insertion Sort compare to playing cards?",
        a: "Just as you insert each new playing card into its correct position in your sorted hand by shifting higher cards to the right."
      },
      {
        q: "Why is Insertion Sort preferred for nearly sorted data?",
        a: "Because inner while loop terminates in O(1) time when elements are already in order, yielding O(n) total run time."
      },
      {
        q: "Is Insertion Sort an online algorithm?",
        a: "Yes, it can sort a list as it receives pieces of it one by one in real-time."
      }
    ],
    code: {
      c: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    insertionSort(arr, n);

    printf("Sorted:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6};

    cout << "Original: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    insertionSort(arr);

    cout << "Sorted:   ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6};

        System.out.print("Original: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();

        insertionSort(arr);

        System.out.print("Sorted:   ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

# Driver Code
arr = [12, 11, 13, 5, 6]
print("Original:", arr)
insertion_sort(arr)
print("Sorted:  ", arr)`
    }
  },

  // ---------------------------------------------------------------------------
  // 6. MERGE SORT
  // ---------------------------------------------------------------------------
  {
    id: "merge-sort",
    title: "Merge Sort Algorithm",
    category: "Sorting",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement the Divide and Conquer Merge Sort algorithm to sort an array in O(n log n) time.",
    complexity: {
      timeBest: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "merge",
      visualizerCat: "sorting"
    },
    sampleIO: {
      input: "Unsorted: [38, 27, 43, 3, 9, 82, 10]",
      output: "Sorted Array: [3, 9, 10, 27, 38, 43, 82]"
    },
    viva: [
      {
        q: "What algorithm design paradigm is used in Merge Sort?",
        a: "Divide and Conquer — divide problem into subproblems, conquer recursively, and combine sorted halves."
      },
      {
        q: "What is the primary drawback of Merge Sort?",
        a: "It requires O(n) auxiliary memory space to merge the two sorted halves."
      },
      {
        q: "Is Merge Sort stable?",
        a: "Yes, when merging, if elements are equal, taking from the left subarray first preserves the original order."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    mergeSort(arr, 0, n - 1);

    printf("Sorted:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);

    for (int k = 0; k < temp.size(); k++) arr[left + k] = temp[k];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main() {
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10};

    cout << "Original: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    mergeSort(arr, 0, arr.size() - 1);

    cout << "Sorted:   ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `public class MergeSort {
    public static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};

        System.out.print("Original: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();

        mergeSort(arr, 0, arr.length - 1);

        System.out.print("Sorted:   ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

# Driver Code
arr = [38, 27, 43, 3, 9, 82, 10]
print("Original:", arr)
merge_sort(arr)
print("Sorted:  ", arr)`
    }
  },

  // ---------------------------------------------------------------------------
  // 7. QUICK SORT
  // ---------------------------------------------------------------------------
  {
    id: "quick-sort",
    title: "Quick Sort Algorithm",
    category: "Sorting",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement Quick Sort using the Lomuto partitioning scheme to sort an array in-place.",
    complexity: {
      timeBest: "O(n log n)",
      timeWorst: "O(n²)",
      space: "O(log n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "quick",
      visualizerCat: "sorting"
    },
    sampleIO: {
      input: "Unsorted: [10, 80, 30, 90, 40, 50, 70]",
      output: "Sorted Array: [10, 30, 40, 50, 70, 80, 90]"
    },
    viva: [
      {
        q: "What causes Quick Sort to degrade to O(n²) worst-case time?",
        a: "When the selected pivot is always the smallest or largest element (e.g. choosing the last element in an already sorted array)."
      },
      {
        q: "Why is Quick Sort often faster in practice than Merge Sort?",
        a: "It has excellent cache locality, performs in-place sorting without auxiliary array allocation, and has smaller constant factors."
      },
      {
        q: "How can the worst-case scenario be avoided?",
        a: "By using Randomized Quick Sort (choosing a random pivot) or Median-of-Three pivot selection."
      }
    ],
    code: {
      c: `#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Pivot as last element
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {10, 80, 30, 90, 40, 50, 70};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    quickSort(arr, 0, n - 1);

    printf("Sorted:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {10, 80, 30, 90, 40, 50, 70};

    cout << "Original: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    quickSort(arr, 0, arr.size() - 1);

    cout << "Sorted:   ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `public class QuickSort {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] arr = {10, 80, 30, 90, 40, 50, 70};

        System.out.print("Original: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();

        quickSort(arr, 0, arr.length - 1);

        System.out.print("Sorted:   ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,
      python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

# Driver Code
arr = [10, 80, 30, 90, 40, 50, 70]
print("Original:", arr)
quick_sort(arr, 0, len(arr) - 1)
print("Sorted:  ", arr)`
    }
  },

  // ---------------------------------------------------------------------------
  // 8. STACK USING ARRAY
  // ---------------------------------------------------------------------------
  {
    id: "stack-array",
    title: "Stack Implementation using Array",
    category: "Stack",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement fundamental stack operations (push, pop, peek, isEmpty, isFull) using a static 1D array.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(1)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "stack",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "Push(10), Push(20), Push(30), Pop(), Peek()",
      output: "Pushed 10\nPushed 20\nPushed 30\nPopped: 30\nTop Element: 20"
    },
    viva: [
      {
        q: "What principle does a Stack follow?",
        a: "LIFO (Last In First Out) — the last element added to the stack is the first one to be removed."
      },
      {
        q: "What are Stack Overflow and Stack Underflow conditions?",
        a: "Overflow occurs when pushing into a completely full stack (top == MAX - 1). Underflow occurs when popping from an empty stack (top == -1)."
      },
      {
        q: "Give real-world applications of stacks in computer science.",
        a: "Function call stacks (recursion), browser history (back button), undo/redo in text editors, and syntax parsing."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <stdbool.h>

#define MAX 5

int stack[MAX];
int top = -1;

bool isFull() {
    return top == MAX - 1;
}

bool isEmpty() {
    return top == -1;
}

void push(int value) {
    if (isFull()) {
        printf("Stack Overflow! Cannot push %d\\n", value);
        return;
    }
    stack[++top] = value;
    printf("Pushed: %d\\n", value);
}

int pop() {
    if (isEmpty()) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return stack[top--];
}

int peek() {
    if (isEmpty()) return -1;
    return stack[top];
}

void display() {
    if (isEmpty()) {
        printf("Stack is empty.\\n");
        return;
    }
    printf("Current Stack (top to bottom): ");
    for (int i = top; i >= 0; i--) printf("%d ", stack[i]);
    printf("\\n");
}

int main() {
    push(10);
    push(20);
    push(30);
    display();

    printf("Popped element: %d\\n", pop());
    printf("Top element after pop: %d\\n", peek());
    display();

    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

class Stack {
    static const int MAX = 5;
    int arr[MAX];
    int top;

public:
    Stack() : top(-1) {}

    bool isFull() const { return top == MAX - 1; }
    bool isEmpty() const { return top == -1; }

    void push(int val) {
        if (isFull()) {
            cout << "Stack Overflow!" << endl;
            return;
        }
        arr[++top] = val;
        cout << "Pushed: " << val << endl;
    }

    int pop() {
        if (isEmpty()) {
            cout << "Stack Underflow!" << endl;
            return -1;
        }
        return arr[top--];
    }

    int peek() const {
        if (isEmpty()) return -1;
        return arr[top];
    }

    void display() const {
        if (isEmpty()) {
            cout << "Stack is empty." << endl;
            return;
        }
        cout << "Stack (top to bottom): ";
        for (int i = top; i >= 0; i--) cout << arr[i] << " ";
        cout << endl;
    }
};

int main() {
    Stack s;
    s.push(10);
    s.push(20);
    s.push(30);
    s.display();

    cout << "Popped: " << s.pop() << endl;
    cout << "Top element: " << s.peek() << endl;
    s.display();

    return 0;
}`,
      java: `public class ArrayStack {
    private static final int MAX = 5;
    private int[] arr = new int[MAX];
    private int top = -1;

    public boolean isFull() { return top == MAX - 1; }
    public boolean isEmpty() { return top == -1; }

    public void push(int val) {
        if (isFull()) {
            System.out.println("Stack Overflow!");
            return;
        }
        arr[++top] = val;
        System.out.println("Pushed: " + val);
    }

    public int pop() {
        if (isEmpty()) {
            System.out.println("Stack Underflow!");
            return -1;
        }
        return arr[top--];
    }

    public int peek() {
        if (isEmpty()) return -1;
        return arr[top];
    }

    public void display() {
        if (isEmpty()) {
            System.out.println("Stack is empty.");
            return;
        }
        System.out.print("Stack (top to bottom): ");
        for (int i = top; i >= 0; i--) System.out.print(arr[i] + " ");
        System.out.println();
    }

    public static void main(String[] args) {
        ArrayStack s = new ArrayStack();
        s.push(10);
        s.push(20);
        s.push(30);
        s.display();

        System.out.println("Popped: " + s.pop());
        System.out.println("Top element: " + s.peek());
        s.display();
    }
}`,
      python: `class ArrayStack:
    def __init__(self, capacity=5):
        self.capacity = capacity
        self.stack = []

    def is_empty(self):
        return len(self.stack) == 0

    def is_full(self):
        return len(self.stack) == self.capacity

    def push(self, val):
        if self.is_full():
            print("Stack Overflow!")
            return
        self.stack.append(val)
        print(f"Pushed: {val}")

    def pop(self):
        if self.is_empty():
            print("Stack Underflow!")
            return None
        return self.stack.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.stack[-1]

    def display(self):
        if self.is_empty():
            print("Stack is empty.")
            return
        print("Stack (top to bottom):", list(reversed(self.stack)))

# Driver Code
s = ArrayStack(5)
s.push(10)
s.push(20)
s.push(30)
s.display()

print("Popped:", s.pop())
print("Top element:", s.peek())
s.display()`
    }
  },

  // ---------------------------------------------------------------------------
  // 9. INFIX TO POSTFIX CONVERSION
  // ---------------------------------------------------------------------------
  {
    id: "infix-to-postfix",
    title: "Infix to Postfix Conversion",
    category: "Stack",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To convert an infix arithmetic expression into a postfix (Reverse Polish) expression using operator stack precedence.",
    complexity: {
      timeBest: "O(n)",
      timeWorst: "O(n)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "stack",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "Infix: a+b*(c^d-e)^(f+g*h)-i",
      output: "Postfix: abcd^e-fgh*+^*+i-"
    },
    viva: [
      {
        q: "Why do compilers convert infix expressions to postfix?",
        a: "Because postfix expressions have no ambiguity, require zero parentheses, and can be evaluated linearly in a single pass using a stack."
      },
      {
        q: "What is the operator precedence order used?",
        a: "^ (Exponent, highest) > *, / (Multiplication/Division) > +, - (Addition/Subtraction, lowest)."
      },
      {
        q: "What is the associativity of the '^' (exponentiation) operator?",
        a: "Right-to-Left, unlike +, -, *, / which are Left-to-Right."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX 100

char stack[MAX];
int top = -1;

void push(char c) { stack[++top] = c; }
char pop() { return stack[top--]; }
char peek() { return stack[top]; }
int isEmpty() { return top == -1; }

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void infixToPostfix(char* infix, char* postfix) {
    int k = 0;
    for (int i = 0; infix[i] != '\\0'; i++) {
        char ch = infix[i];

        if (isalnum(ch)) {
            postfix[k++] = ch; // Operand -> Output
        } else if (ch == '(') {
            push(ch);
        } else if (ch == ')') {
            while (!isEmpty() && peek() != '(') {
                postfix[k++] = pop();
            }
            pop(); // Remove '('
        } else {
            // Operator
            while (!isEmpty() && precedence(peek()) >= precedence(ch)) {
                postfix[k++] = pop();
            }
            push(ch);
        }
    }

    while (!isEmpty()) {
        postfix[k++] = pop();
    }
    postfix[k] = '\\0';
}

int main() {
    char infix[] = "(A+B)*(C-D)";
    char postfix[MAX];

    infixToPostfix(infix, postfix);
    printf("Infix Expression:   %s\\n", infix);
    printf("Postfix Expression: %s\\n", postfix);
    return 0;
}`,
      cpp: `#include <iostream>
#include <stack>
#include <string>
#include <cctype>
using namespace std;

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

string infixToPostfix(const string& s) {
    stack<char> st;
    string result = "";

    for (char c : s) {
        if (isalnum(c)) {
            result += c;
        } else if (c == '(') {
            st.push(c);
        } else if (c == ')') {
            while (!st.empty() && st.top() != '(') {
                result += st.top();
                st.pop();
            }
            if (!st.empty()) st.pop();
        } else {
            while (!st.empty() && precedence(st.top()) >= precedence(c)) {
                result += st.top();
                st.pop();
            }
            st.push(c);
        }
    }

    while (!st.empty()) {
        result += st.top();
        st.pop();
    }
    return result;
}

int main() {
    string infix = "(A+B)*(C-D)";
    cout << "Infix:   " << infix << endl;
    cout << "Postfix: " << infixToPostfix(infix) << endl;
    return 0;
}`,
      java: `import java.util.Stack;

public class InfixToPostfix {
    static int precedence(char ch) {
        switch (ch) {
            case '+': case '-': return 1;
            case '*': case '/': return 2;
            case '^': return 3;
        }
        return -1;
    }

    public static String convert(String exp) {
        StringBuilder result = new StringBuilder();
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < exp.length(); i++) {
            char c = exp.charAt(i);

            if (Character.isLetterOrDigit(c)) {
                result.append(c);
            } else if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    result.append(stack.pop());
                }
                stack.pop();
            } else {
                while (!stack.isEmpty() && precedence(stack.peek()) >= precedence(c)) {
                    result.append(stack.pop());
                }
                stack.push(c);
            }
        }

        while (!stack.isEmpty()) {
            result.append(stack.pop());
        }
        return result.toString();
    }

    public static void main(String[] args) {
        String infix = "(A+B)*(C-D)";
        System.out.println("Infix:   " + infix);
        System.out.println("Postfix: " + convert(infix));
    }
}`,
      python: `def precedence(op):
    if op == '^': return 3
    if op in ('*', '/'): return 2
    if op in ('+', '-'): return 1
    return 0

def infix_to_postfix(expression):
    stack = []
    output = []

    for char in expression:
        if char.isalnum():
            output.append(char)
        elif char == '(':
            stack.append(char)
        elif char == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            if stack:
                stack.pop()
        else:
            while stack and precedence(stack[-1]) >= precedence(char):
                output.append(stack.pop())
            stack.append(char)

    while stack:
        output.append(stack.pop())

    return "".join(output)

# Driver Code
infix = "(A+B)*(C-D)"
print("Infix:  ", infix)
print("Postfix:", infix_to_postfix(infix))`
    }
  },

  // ---------------------------------------------------------------------------
  // 10. POSTFIX EXPRESSION EVALUATION
  // ---------------------------------------------------------------------------
  {
    id: "postfix-eval",
    title: "Evaluation of Postfix Expression",
    category: "Stack",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To evaluate a postfix arithmetic expression using an operand stack.",
    complexity: {
      timeBest: "O(n)",
      timeWorst: "O(n)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "stack",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "Postfix: 231*+9-",
      output: "Result of evaluation: -4"
    },
    viva: [
      {
        q: "How does stack-based postfix evaluation work?",
        a: "Operands are pushed onto the stack. When an operator is encountered, the top two operands are popped, evaluated with that operator, and the result is pushed back."
      },
      {
        q: "In what order are the two operands applied?",
        a: "First popped is operand 2 (right operand), and second popped is operand 1 (left operand): result = operand1 (op) operand2."
      },
      {
        q: "What should remain in the stack after complete evaluation?",
        a: "Exactly one value, which represents the final evaluated result of the entire expression."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>

#define MAX 100

int stack[MAX];
int top = -1;

void push(int val) { stack[++top] = val; }
int pop() { return stack[top--]; }

int evaluatePostfix(char* exp) {
    for (int i = 0; exp[i] != '\\0'; i++) {
        if (isdigit(exp[i])) {
            push(exp[i] - '0'); // Convert char digit to integer
        } else {
            int val2 = pop();
            int val1 = pop();
            switch (exp[i]) {
                case '+': push(val1 + val2); break;
                case '-': push(val1 - val2); break;
                case '*': push(val1 * val2); break;
                case '/': push(val1 / val2); break;
            }
        }
    }
    return pop();
}

int main() {
    char exp[] = "231*+9-";
    printf("Postfix Expression: %s\\n", exp);
    printf("Evaluated Result:   %d\\n", evaluatePostfix(exp));
    return 0;
}`,
      cpp: `#include <iostream>
#include <stack>
#include <cctype>
#include <string>
using namespace std;

int evaluatePostfix(const string& exp) {
    stack<int> st;

    for (char c : exp) {
        if (isdigit(c)) {
            st.push(c - '0');
        } else {
            int val2 = st.top(); st.pop();
            int val1 = st.top(); st.pop();
            switch (c) {
                case '+': st.push(val1 + val2); break;
                case '-': st.push(val1 - val2); break;
                case '*': st.push(val1 * val2); break;
                case '/': st.push(val1 / val2); break;
            }
        }
    }
    return st.top();
}

int main() {
    string exp = "231*+9-";
    cout << "Postfix Expression: " << exp << endl;
    cout << "Evaluated Result:   " << evaluatePostfix(exp) << endl;
    return 0;
}`,
      java: `import java.util.Stack;

public class PostfixEvaluation {
    public static int evaluate(String exp) {
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < exp.length(); i++) {
            char c = exp.charAt(i);
            if (Character.isDigit(c)) {
                stack.push(c - '0');
            } else {
                int val2 = stack.pop();
                int val1 = stack.pop();
                switch (c) {
                    case '+': stack.push(val1 + val2); break;
                    case '-': stack.push(val1 - val2); break;
                    case '*': stack.push(val1 * val2); break;
                    case '/': stack.push(val1 / val2); break;
                }
            }
        }
        return stack.pop();
    }

    public static void main(String[] args) {
        String exp = "231*+9-";
        System.out.println("Postfix Expression: " + exp);
        System.out.println("Evaluated Result:   " + evaluate(exp));
    }
}`,
      python: `def evaluate_postfix(exp):
    stack = []
    for char in exp:
        if char.isdigit():
            stack.append(int(char))
        else:
            val2 = stack.pop()
            val1 = stack.pop()
            if char == '+': stack.append(val1 + val2)
            elif char == '-': stack.append(val1 - val2)
            elif char == '*': stack.append(val1 * val2)
            elif char == '/': stack.append(int(val1 / val2))
    return stack.pop()

# Driver Code
exp = "231*+9-"
print("Postfix Expression:", exp)
print("Evaluated Result:  ", evaluate_postfix(exp))`
    }
  },

  // ---------------------------------------------------------------------------
  // 11. LINEAR QUEUE USING ARRAY
  // ---------------------------------------------------------------------------
  {
    id: "queue-linear",
    title: "Linear Queue using Array",
    category: "Queue",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement basic queue operations (enqueue, dequeue, peek, display) using a static 1D array.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(1)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "queue",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "Enqueue(10), Enqueue(20), Enqueue(30), Dequeue(), Peek()",
      output: "Enqueued: 10\nEnqueued: 20\nEnqueued: 30\nDequeued: 10\nFront Element: 20"
    },
    viva: [
      {
        q: "What principle does a Queue follow?",
        a: "FIFO (First In First Out) — elements are added at the rear and removed from the front."
      },
      {
        q: "What is the primary drawback of a Linear Queue implemented with an array?",
        a: "False overflow: even if empty spaces exist at the front after several dequeues, new items cannot be enqueued once rear reaches MAX - 1."
      },
      {
        q: "How is the false overflow limitation overcome?",
        a: "By using a Circular Queue or dynamic Linked List queue."
      }
    ],
    code: {
      c: `#include <stdio.h>
#define MAX 5

int queue[MAX];
int front = -1, rear = -1;

int isFull() { return rear == MAX - 1; }
int isEmpty() { return front == -1 || front > rear; }

void enqueue(int val) {
    if (isFull()) {
        printf("Queue Overflow! Cannot insert %d\\n", val);
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = val;
    printf("Enqueued: %d\\n", val);
}

int dequeue() {
    if (isEmpty()) {
        printf("Queue Underflow!\\n");
        return -1;
    }
    int val = queue[front++];
    if (front > rear) { // Reset queue when empty
        front = rear = -1;
    }
    return val;
}

void display() {
    if (isEmpty()) {
        printf("Queue is empty.\\n");
        return;
    }
    printf("Queue elements: ");
    for (int i = front; i <= rear; i++) printf("%d ", queue[i]);
    printf("\\n");
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    display();

    printf("Dequeued: %d\\n", dequeue());
    display();
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

class LinearQueue {
    static const int MAX = 5;
    int arr[MAX];
    int front, rear;

public:
    LinearQueue() : front(-1), rear(-1) {}

    bool isFull() const { return rear == MAX - 1; }
    bool isEmpty() const { return front == -1 || front > rear; }

    void enqueue(int val) {
        if (isFull()) {
            cout << "Queue Overflow!" << endl;
            return;
        }
        if (front == -1) front = 0;
        arr[++rear] = val;
        cout << "Enqueued: " << val << endl;
    }

    int dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow!" << endl;
            return -1;
        }
        int val = arr[front++];
        if (front > rear) front = rear = -1;
        return val;
    }

    void display() const {
        if (isEmpty()) {
            cout << "Queue is empty." << endl;
            return;
        }
        cout << "Queue: ";
        for (int i = front; i <= rear; i++) cout << arr[i] << " ";
        cout << endl;
    }
};

int main() {
    LinearQueue q;
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.display();

    cout << "Dequeued: " << q.dequeue() << endl;
    q.display();
    return 0;
}`,
      java: `public class LinearQueue {
    private static final int MAX = 5;
    private int[] arr = new int[MAX];
    private int front = -1, rear = -1;

    public boolean isFull() { return rear == MAX - 1; }
    public boolean isEmpty() { return front == -1 || front > rear; }

    public void enqueue(int val) {
        if (isFull()) {
            System.out.println("Queue Overflow!");
            return;
        }
        if (front == -1) front = 0;
        arr[++rear] = val;
        System.out.println("Enqueued: " + val);
    }

    public int dequeue() {
        if (isEmpty()) {
            System.out.println("Queue Underflow!");
            return -1;
        }
        int val = arr[front++];
        if (front > rear) front = rear = -1;
        return val;
    }

    public void display() {
        if (isEmpty()) {
            System.out.println("Queue is empty.");
            return;
        }
        System.out.print("Queue: ");
        for (int i = front; i <= rear; i++) System.out.print(arr[i] + " ");
        System.out.println();
    }

    public static void main(String[] args) {
        LinearQueue q = new LinearQueue();
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.display();

        System.out.println("Dequeued: " + q.dequeue());
        q.display();
    }
}`,
      python: `class LinearQueue:
    def __init__(self, capacity=5):
        self.capacity = capacity
        self.queue = []

    def is_empty(self): return len(self.queue) == 0
    def is_full(self): return len(self.queue) == self.capacity

    def enqueue(self, val):
        if self.is_full():
            print("Queue Overflow!")
            return
        self.queue.append(val)
        print(f"Enqueued: {val}")

    def dequeue(self):
        if self.is_empty():
            print("Queue Underflow!")
            return None
        return self.queue.pop(0)

    def display(self):
        if self.is_empty():
            print("Queue is empty.")
            return
        print("Queue elements:", self.queue)

# Driver Code
q = LinearQueue(5)
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
q.display()

print("Dequeued:", q.dequeue())
q.display()`
    }
  },

  // ---------------------------------------------------------------------------
  // 12. CIRCULAR QUEUE USING ARRAY
  // ---------------------------------------------------------------------------
  {
    id: "queue-circular",
    title: "Circular Queue using Array",
    category: "Queue",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement a Circular Queue using modulo arithmetic to eliminate the false overflow limitation of linear queues.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(1)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "queue",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "Enqueue(10), Enqueue(20), Enqueue(30), Dequeue(), Enqueue(40), Enqueue(50), Enqueue(60)",
      output: "Queue wraps around front spaces successfully without false overflow."
    },
    viva: [
      {
        q: "What is the condition for Circular Queue full?",
        a: "(rear + 1) % MAX == front."
      },
      {
        q: "How does modulo arithmetic help in a circular queue?",
        a: "When rear reaching MAX - 1, (rear + 1) % MAX wraps back around to index 0 if space has been freed by dequeue operations."
      },
      {
        q: "How do you distinguish between an empty and a full circular queue?",
        a: "Empty when front == -1. Full when (rear + 1) % MAX == front."
      }
    ],
    code: {
      c: `#include <stdio.h>
#define SIZE 5

int items[SIZE];
int front = -1, rear = -1;

int isFull() {
    return (front == (rear + 1) % SIZE);
}

int isEmpty() {
    return front == -1;
}

void enqueue(int element) {
    if (isFull()) {
        printf("Circular Queue is Full!\\n");
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % SIZE;
    items[rear] = element;
    printf("Inserted -> %d\\n", element);
}

int dequeue() {
    if (isEmpty()) {
        printf("Circular Queue is Empty!\\n");
        return -1;
    }
    int element = items[front];
    if (front == rear) {
        front = rear = -1; // Queue reset
    } else {
        front = (front + 1) % SIZE;
    }
    return element;
}

void display() {
    if (isEmpty()) {
        printf("Empty Queue\\n");
        return;
    }
    printf("Circular Queue: ");
    int i = front;
    while (1) {
        printf("%d ", items[i]);
        if (i == rear) break;
        i = (i + 1) % SIZE;
    }
    printf("\\n");
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    enqueue(40);
    display();

    printf("Dequeued: %d\\n", dequeue());
    printf("Dequeued: %d\\n", dequeue());
    display();

    enqueue(50);
    enqueue(60); // Wraps around to index 0 and 1!
    display();
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

class CircularQueue {
    static const int SIZE = 5;
    int items[SIZE];
    int front, rear;

public:
    CircularQueue() : front(-1), rear(-1) {}

    bool isFull() const { return (front == (rear + 1) % SIZE); }
    bool isEmpty() const { return front == -1; }

    void enqueue(int val) {
        if (isFull()) {
            cout << "Queue is Full!" << endl;
            return;
        }
        if (front == -1) front = 0;
        rear = (rear + 1) % SIZE;
        items[rear] = val;
        cout << "Inserted -> " << val << endl;
    }

    int dequeue() {
        if (isEmpty()) {
            cout << "Queue is Empty!" << endl;
            return -1;
        }
        int val = items[front];
        if (front == rear) {
            front = rear = -1;
        } else {
            front = (front + 1) % SIZE;
        }
        return val;
    }

    void display() const {
        if (isEmpty()) {
            cout << "Empty Queue" << endl;
            return;
        }
        cout << "Circular Queue: ";
        int i = front;
        while (true) {
            cout << items[i] << " ";
            if (i == rear) break;
            i = (i + 1) % SIZE;
        }
        cout << endl;
    }
};

int main() {
    CircularQueue q;
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.display();

    cout << "Dequeued: " << q.dequeue() << endl;
    q.enqueue(40);
    q.enqueue(50);
    q.display();
    return 0;
}`,
      java: `public class CircularQueue {
    private static final int SIZE = 5;
    private int[] items = new int[SIZE];
    private int front = -1, rear = -1;

    public boolean isFull() { return (front == (rear + 1) % SIZE); }
    public boolean isEmpty() { return front == -1; }

    public void enqueue(int val) {
        if (isFull()) {
            System.out.println("Queue is Full!");
            return;
        }
        if (front == -1) front = 0;
        rear = (rear + 1) % SIZE;
        items[rear] = val;
        System.out.println("Inserted -> " + val);
    }

    public int dequeue() {
        if (isEmpty()) {
            System.out.println("Queue is Empty!");
            return -1;
        }
        int val = items[front];
        if (front == rear) {
            front = rear = -1;
        } else {
            front = (front + 1) % SIZE;
        }
        return val;
    }

    public void display() {
        if (isEmpty()) {
            System.out.println("Empty Queue");
            return;
        }
        System.out.print("Circular Queue: ");
        int i = front;
        while (true) {
            System.out.print(items[i] + " ");
            if (i == rear) break;
            i = (i + 1) % SIZE;
        }
        System.out.println();
    }

    public static void main(String[] args) {
        CircularQueue q = new CircularQueue();
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.display();

        System.out.println("Dequeued: " + q.dequeue());
        q.enqueue(40);
        q.enqueue(50);
        q.display();
    }
}`,
      python: `class CircularQueue:
    def __init__(self, size=5):
        self.size = size
        self.queue = [None] * size
        self.front = -1
        self.rear = -1

    def is_full(self):
        return (self.rear + 1) % self.size == self.front

    def is_empty(self):
        return self.front == -1

    def enqueue(self, val):
        if self.is_full():
            print("Queue is Full!")
            return
        if self.front == -1:
            self.front = 0
        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = val
        print(f"Inserted -> {val}")

    def dequeue(self):
        if self.is_empty():
            print("Queue is Empty!")
            return None
        val = self.queue[self.front]
        if self.front == self.rear:
            self.front = self.rear = -1
        else:
            self.front = (self.front + 1) % self.size
        return val

    def display(self):
        if self.is_empty():
            print("Empty Queue")
            return
        res = []
        i = self.front
        while True:
            res.append(self.queue[i])
            if i == self.rear:
                break
            i = (i + 1) % self.size
        print("Circular Queue:", res)

# Driver Code
q = CircularQueue(5)
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
q.display()

print("Dequeued:", q.dequeue())
q.enqueue(40)
q.enqueue(50)
q.display()`
    }
  },

  // ---------------------------------------------------------------------------
  // 13. SINGLY LINKED LIST
  // ---------------------------------------------------------------------------
  {
    id: "singly-linked-list",
    title: "Singly Linked List Operations",
    category: "Linked List",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement dynamic creation, insertion at beginning, insertion at end, deletion of node, and traversal in a Singly Linked List.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(n)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "singly",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "InsertHead(10), InsertTail(20), InsertHead(5), Delete(10), Display()",
      output: "Linked List: 5 -> 20 -> NULL"
    },
    viva: [
      {
        q: "What is the memory advantage of a Linked List over an Array?",
        a: "Linked lists allocate nodes dynamically in heap memory as needed, preventing wasted pre-allocated memory and allowing easy resizing."
      },
      {
        q: "What is the time complexity of inserting at the head of a Singly Linked List?",
        a: "O(1) constant time, as only pointer reassignment is required without shifting elements."
      },
      {
        q: "What is a NULL pointer in a linked list node?",
        a: "It marks the termination of the list, indicating that the current node is the tail node."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* head = NULL;

void insertAtHead(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = head;
    head = newNode;
    printf("Inserted at Head: %d\\n", val);
}

void insertAtTail(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;

    if (head == NULL) {
        head = newNode;
        return;
    }
    struct Node* temp = head;
    while (temp->next != NULL) temp = temp->next;
    temp->next = newNode;
    printf("Inserted at Tail: %d\\n", val);
}

void deleteNode(int key) {
    struct Node *temp = head, *prev = NULL;
    if (temp != NULL && temp->data == key) {
        head = temp->next;
        free(temp);
        printf("Deleted node: %d\\n", key);
        return;
    }
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }
    if (temp == NULL) {
        printf("Element %d not found\\n", key);
        return;
    }
    prev->next = temp->next;
    free(temp);
    printf("Deleted node: %d\\n", key);
}

void display() {
    struct Node* temp = head;
    printf("Linked List: ");
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    insertAtHead(10);
    insertAtTail(20);
    insertAtHead(5);
    display();

    deleteNode(10);
    display();
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class SinglyLinkedList {
    Node* head;
public:
    SinglyLinkedList() : head(nullptr) {}

    void insertAtHead(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
        cout << "Inserted at Head: " << val << endl;
    }

    void insertAtTail(int val) {
        Node* newNode = new Node(val);
        if (!head) { head = newNode; return; }
        Node* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
        cout << "Inserted at Tail: " << val << endl;
    }

    void deleteNode(int key) {
        Node *temp = head, *prev = nullptr;
        if (temp && temp->data == key) {
            head = temp->next;
            delete temp;
            cout << "Deleted node: " << key << endl;
            return;
        }
        while (temp && temp->data != key) {
            prev = temp;
            temp = temp->next;
        }
        if (!temp) return;
        prev->next = temp->next;
        delete temp;
        cout << "Deleted node: " << key << endl;
    }

    void display() const {
        Node* temp = head;
        cout << "Linked List: ";
        while (temp) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }
};

int main() {
    SinglyLinkedList list;
    list.insertAtHead(10);
    list.insertAtTail(20);
    list.insertAtHead(5);
    list.display();

    list.deleteNode(10);
    list.display();
    return 0;
}`,
      java: `public class SinglyLinkedList {
    static class Node {
        int data;
        Node next;
        Node(int data) { this.data = data; }
    }

    private Node head;

    public void insertAtHead(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        head = newNode;
        System.out.println("Inserted at Head: " + val);
    }

    public void insertAtTail(int val) {
        Node newNode = new Node(val);
        if (head == null) { head = newNode; return; }
        Node temp = head;
        while (temp.next != null) temp = temp.next;
        temp.next = newNode;
        System.out.println("Inserted at Tail: " + val);
    }

    public void deleteNode(int key) {
        Node temp = head, prev = null;
        if (temp != null && temp.data == key) {
            head = temp.next;
            System.out.println("Deleted node: " + key);
            return;
        }
        while (temp != null && temp.data != key) {
            prev = temp;
            temp = temp.next;
        }
        if (temp == null) return;
        prev.next = temp.next;
        System.out.println("Deleted node: " + key);
    }

    public void display() {
        Node temp = head;
        System.out.print("Linked List: ");
        while (temp != null) {
            System.out.print(temp.data + " -> ");
            temp = temp.next;
        }
        System.out.println("NULL");
    }

    public static void main(String[] args) {
        SinglyLinkedList list = new SinglyLinkedList();
        list.insertAtHead(10);
        list.insertAtTail(20);
        list.insertAtHead(5);
        list.display();

        list.deleteNode(10);
        list.display();
    }
}`,
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, val):
        new_node = Node(val)
        new_node.next = self.head
        self.head = new_node
        print(f"Inserted at Head: {val}")

    def insert_at_tail(self, val):
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            return
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node
        print(f"Inserted at Tail: {val}")

    def delete_node(self, key):
        temp = self.head
        prev = None
        if temp and temp.data == key:
            self.head = temp.next
            print(f"Deleted node: {key}")
            return
        while temp and temp.data != key:
            prev = temp
            temp = temp.next
        if not temp:
            return
        prev.next = temp.next
        print(f"Deleted node: {key}")

    def display(self):
        temp = self.head
        res = []
        while temp:
            res.append(str(temp.data))
            temp = temp.next
        print("Linked List: " + " -> ".join(res) + " -> NULL")

# Driver Code
ll = SinglyLinkedList()
ll.insert_at_head(10)
ll.insert_at_tail(20)
ll.insert_at_head(5)
ll.display()

ll.delete_node(10)
ll.display()`
    }
  },

  // ---------------------------------------------------------------------------
  // 14. DOUBLY LINKED LIST
  // ---------------------------------------------------------------------------
  {
    id: "doubly-linked-list",
    title: "Doubly Linked List Operations",
    category: "Linked List",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To implement two-way bidirectional traversal, insertion at head/tail, and deletion in a Doubly Linked List.",
    complexity: {
      timeBest: "O(1)",
      timeWorst: "O(n)",
      space: "O(n)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "doubly",
      visualizerCat: "linear"
    },
    sampleIO: {
      input: "Insert(10), Insert(20), Insert(30), DisplayForward(), DisplayReverse()",
      output: "Forward: 10 <-> 20 <-> 30\nReverse: 30 <-> 20 <-> 10"
    },
    viva: [
      {
        q: "What extra field does a Doubly Linked List node contain compared to Singly?",
        a: "A 'prev' pointer pointing to the predecessor node, allowing bidirectional navigation."
      },
      {
        q: "What is a disadvantage of a Doubly Linked List?",
        a: "Requires extra memory per node for the previous pointer and extra pointer manipulation on insertions/deletions."
      },
      {
        q: "Can a node be deleted in O(1) in a Doubly Linked List given its direct pointer?",
        a: "Yes, because its predecessor can be reached directly via node->prev without traversing from the head."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* prev;
    struct Node* next;
};

struct Node* head = NULL;

void insertEnd(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;

    if (head == NULL) {
        newNode->prev = NULL;
        head = newNode;
        return;
    }
    struct Node* temp = head;
    while (temp->next != NULL) temp = temp->next;
    temp->next = newNode;
    newNode->prev = temp;
}

void displayForward() {
    struct Node* temp = head;
    printf("Forward: ");
    while (temp != NULL) {
        printf("%d <-> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

void displayReverse() {
    struct Node* temp = head;
    if (temp == NULL) return;
    while (temp->next != NULL) temp = temp->next;

    printf("Reverse: ");
    while (temp != NULL) {
        printf("%d <-> ", temp->data);
        temp = temp->prev;
    }
    printf("NULL\\n");
}

int main() {
    insertEnd(10);
    insertEnd(20);
    insertEnd(30);

    displayForward();
    displayReverse();
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* prev;
    Node* next;
    Node(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
    Node* head;
public:
    DoublyLinkedList() : head(nullptr) {}

    void insertEnd(int val) {
        Node* newNode = new Node(val);
        if (!head) { head = newNode; return; }
        Node* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
        newNode->prev = temp;
    }

    void displayForward() const {
        Node* temp = head;
        cout << "Forward: ";
        while (temp) {
            cout << temp->data << " <-> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }

    void displayReverse() const {
        Node* temp = head;
        if (!temp) return;
        while (temp->next) temp = temp->next;
        cout << "Reverse: ";
        while (temp) {
            cout << temp->data << " <-> ";
            temp = temp->prev;
        }
        cout << "NULL" << endl;
    }
};

int main() {
    DoublyLinkedList dll;
    dll.insertEnd(10);
    dll.insertEnd(20);
    dll.insertEnd(30);

    dll.displayForward();
    dll.displayReverse();
    return 0;
}`,
      java: `public class DoublyLinkedList {
    static class Node {
        int data;
        Node prev, next;
        Node(int data) { this.data = data; }
    }

    private Node head;

    public void insertEnd(int val) {
        Node newNode = new Node(val);
        if (head == null) { head = newNode; return; }
        Node temp = head;
        while (temp.next != null) temp = temp.next;
        temp.next = newNode;
        newNode.prev = temp;
    }

    public void displayForward() {
        Node temp = head;
        System.out.print("Forward: ");
        while (temp != null) {
            System.out.print(temp.data + " <-> ");
            temp = temp.next;
        }
        System.out.println("NULL");
    }

    public void displayReverse() {
        Node temp = head;
        if (temp == null) return;
        while (temp.next != null) temp = temp.next;
        System.out.print("Reverse: ");
        while (temp != null) {
            System.out.print(temp.data + " <-> ");
            temp = temp.prev;
        }
        System.out.println("NULL");
    }

    public static void main(String[] args) {
        DoublyLinkedList dll = new DoublyLinkedList();
        dll.insertEnd(10);
        dll.insertEnd(20);
        dll.insertEnd(30);

        dll.displayForward();
        dll.displayReverse();
    }
}`,
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    def insert_end(self, val):
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            return
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node
        new_node.prev = temp

    def display_forward(self):
        temp = self.head
        res = []
        while temp:
            res.append(str(temp.data))
            temp = temp.next
        print("Forward: " + " <-> ".join(res) + " <-> NULL")

    def display_reverse(self):
        temp = self.head
        if not temp: return
        while temp.next:
            temp = temp.next
        res = []
        while temp:
            res.append(str(temp.data))
            temp = temp.prev
        print("Reverse: " + " <-> ".join(res) + " <-> NULL")

# Driver Code
dll = DoublyLinkedList()
dll.insert_end(10)
dll.insert_end(20)
dll.insert_end(30)

dll.display_forward()
dll.display_reverse()`
    }
  },

  // ---------------------------------------------------------------------------
  // 15. BINARY SEARCH TREE (BST)
  // ---------------------------------------------------------------------------
  {
    id: "binary-search-tree",
    title: "Binary Search Tree (BST) Traversals",
    category: "Tree",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To construct a Binary Search Tree and perform recursive Inorder, Preorder, and Postorder depth-first traversals.",
    complexity: {
      timeBest: "O(log n)",
      timeWorst: "O(n)",
      space: "O(h)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "bst",
      visualizerCat: "tree"
    },
    sampleIO: {
      input: "Insert nodes: [50, 30, 20, 40, 70, 60, 80]",
      output: "Inorder:   20 30 40 50 60 70 80 (Sorted!)\nPreorder:  50 30 20 40 70 60 80\nPostorder: 20 40 30 60 80 70 50"
    },
    viva: [
      {
        q: "What is the defining property of a Binary Search Tree?",
        a: "For any node N, all values in its left subtree are strictly less than N, and all values in its right subtree are strictly greater than N."
      },
      {
        q: "What is unique about the Inorder traversal of a BST?",
        a: "Inorder traversal (Left, Root, Right) always outputs the keys in ascending sorted order."
      },
      {
        q: "When does a BST become skewed with O(n) search time?",
        a: "When keys are inserted in strictly increasing or strictly decreasing sorted order, causing the tree to degrade into a linked list."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

struct Node* createNode(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->left = newNode->right = NULL;
    return newNode;
}

struct Node* insert(struct Node* root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->data)
        root->left = insert(root->left, val);
    else if (val > root->data)
        root->right = insert(root->right, val);
    return root;
}

void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

void preorder(struct Node* root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorder(root->left);
        preorder(root->right);
    }
}

void postorder(struct Node* root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->data);
    }
}

int main() {
    struct Node* root = NULL;
    int keys[] = {50, 30, 20, 40, 70, 60, 80};
    int n = sizeof(keys) / sizeof(keys[0]);

    for (int i = 0; i < n; i++) root = insert(root, keys[i]);

    printf("Inorder Traversal:   ");
    inorder(root);
    printf("\\nPreorder Traversal:  ");
    preorder(root);
    printf("\\nPostorder Traversal: ");
    postorder(root);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *left, *right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->data) root->left = insert(root->left, val);
    else if (val > root->data) root->right = insert(root->right, val);
    return root;
}

void inorder(Node* root) {
    if (root) {
        inorder(root->left);
        cout << root->data << " ";
        inorder(root->right);
    }
}

void preorder(Node* root) {
    if (root) {
        cout << root->data << " ";
        preorder(root->left);
        preorder(root->right);
    }
}

void postorder(Node* root) {
    if (root) {
        postorder(root->left);
        postorder(root->right);
        cout << root->data << " ";
    }
}

int main() {
    Node* root = nullptr;
    int keys[] = {50, 30, 20, 40, 70, 60, 80};
    for (int k : keys) root = insert(root, k);

    cout << "Inorder:   "; inorder(root); cout << endl;
    cout << "Preorder:  "; preorder(root); cout << endl;
    cout << "Postorder: "; postorder(root); cout << endl;
    return 0;
}`,
      java: `public class BinarySearchTree {
    static class Node {
        int data;
        Node left, right;
        Node(int data) { this.data = data; }
    }

    public static Node insert(Node root, int val) {
        if (root == null) return new Node(val);
        if (val < root.data) root.left = insert(root.left, val);
        else if (val > root.data) root.right = insert(root.right, val);
        return root;
    }

    public static void inorder(Node root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.data + " ");
            inorder(root.right);
        }
    }

    public static void preorder(Node root) {
        if (root != null) {
            System.out.print(root.data + " ");
            preorder(root.left);
            preorder(root.right);
        }
    }

    public static void postorder(Node root) {
        if (root != null) {
            postorder(root.left);
            postorder(root.right);
            System.out.print(root.data + " ");
        }
    }

    public static void main(String[] args) {
        Node root = null;
        int[] keys = {50, 30, 20, 40, 70, 60, 80};
        for (int k : keys) root = insert(root, k);

        System.out.print("Inorder:   "); inorder(root); System.out.println();
        System.out.print("Preorder:  "); preorder(root); System.out.println();
        System.out.print("Postorder: "); postorder(root); System.out.println();
    }
}`,
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.data:
        root.left = insert(root.left, val)
    elif val > root.data:
        root.right = insert(root.right, val)
    return root

def inorder(root, res):
    if root:
        inorder(root.left, res)
        res.append(str(root.data))
        inorder(root.right, res)

def preorder(root, res):
    if root:
        res.append(str(root.data))
        preorder(root.left, res)
        preorder(root.right, res)

def postorder(root, res):
    if root:
        postorder(root.left, res)
        postorder(root.right, res)
        res.append(str(root.data))

# Driver Code
root = None
keys = [50, 30, 20, 40, 70, 60, 80]
for k in keys:
    root = insert(root, k)

ino, pre, post = [], [], []
inorder(root, ino)
preorder(root, pre)
postorder(root, post)

print("Inorder:  ", " ".join(ino))
print("Preorder: ", " ".join(pre))
print("Postorder:", " ".join(post))`
    }
  },

  // ---------------------------------------------------------------------------
  // 16. GRAPH TRAVERSAL (BFS & DFS)
  // ---------------------------------------------------------------------------
  {
    id: "graph-bfs-dfs",
    title: "Graph Traversal (BFS & DFS)",
    category: "Graph",
    courses: ["BCA", "BSc", "B.Tech"],
    aim: "To represent an undirected graph using an Adjacency List and implement Breadth-First Search (Queue) and Depth-First Search (Recursion).",
    complexity: {
      timeBest: "O(V + E)",
      timeWorst: "O(V + E)",
      space: "O(V)"
    },
    tracerSupport: {
      lang: "cpp",
      visualizerAlgo: "bfs",
      visualizerCat: "graph"
    },
    sampleIO: {
      input: "Edges: (0-1), (0-2), (1-2), (2-0), (2-3), (3-3)\nStart Node: 2",
      output: "BFS from vertex 2: 2 0 3 1\nDFS from vertex 2: 2 0 1 3"
    },
    viva: [
      {
        q: "What data structures are used for BFS and DFS?",
        a: "BFS uses a Queue (FIFO) for level-order exploration. DFS uses a Stack (or function call stack via recursion)."
      },
      {
        q: "Why do graph traversals require a 'visited' array?",
        a: "To prevent infinite loops caused by cycles and to ensure each vertex is processed exactly once."
      },
      {
        q: "What are the common graph representations?",
        a: "Adjacency Matrix (space O(V²), fast edge lookup) and Adjacency List (space O(V + E), memory efficient for sparse graphs)."
      }
    ],
    code: {
      c: `#include <stdio.h>
#include <stdbool.h>

#define V 4

void BFS(int adj[V][V], int start) {
    bool visited[V] = {false};
    int queue[V], front = 0, rear = 0;

    visited[start] = true;
    queue[rear++] = start;

    printf("BFS Traversal: ");
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);

        for (int v = 0; v < V; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = true;
                queue[rear++] = v;
            }
        }
    }
    printf("\\n");
}

void DFSUtil(int adj[V][V], int u, bool visited[]) {
    visited[u] = true;
    printf("%d ", u);

    for (int v = 0; v < V; v++) {
        if (adj[u][v] && !visited[v]) {
            DFSUtil(adj, v, visited);
        }
    }
}

void DFS(int adj[V][V], int start) {
    bool visited[V] = {false};
    printf("DFS Traversal: ");
    DFSUtil(adj, start, visited);
    printf("\\n");
}

int main() {
    int adj[V][V] = {
        {0, 1, 1, 0},
        {1, 0, 1, 0},
        {1, 1, 0, 1},
        {0, 0, 1, 0}
    };

    BFS(adj, 2);
    DFS(adj, 2);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> adj;

    void DFSUtil(int v, vector<bool>& visited) {
        visited[v] = true;
        cout << v << " ";
        for (int u : adj[v]) {
            if (!visited[u]) DFSUtil(u, visited);
        }
    }

public:
    Graph(int v) : V(v), adj(v) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void BFS(int start) {
        vector<bool> visited(V, false);
        queue<int> q;

        visited[start] = true;
        q.push(start);

        cout << "BFS Traversal: ";
        while (!q.empty()) {
            int u = q.front(); q.pop();
            cout << u << " ";
            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.push(v);
                }
            }
        }
        cout << endl;
    }

    void DFS(int start) {
        vector<bool> visited(V, false);
        cout << "DFS Traversal: ";
        DFSUtil(start, visited);
        cout << endl;
    }
};

int main() {
    Graph g(4);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 2);
    g.addEdge(2, 3);

    g.BFS(2);
    g.DFS(2);
    return 0;
}`,
      java: `import java.util.*;

public class GraphBFSDFS {
    private int V;
    private List<List<Integer>> adj;

    public GraphBFSDFS(int v) {
        this.V = v;
        adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u);
    }

    public void BFS(int start) {
        boolean[] visited = new boolean[V];
        Queue<Integer> queue = new LinkedList<>();

        visited[start] = true;
        queue.add(start);

        System.out.print("BFS Traversal: ");
        while (!queue.isEmpty()) {
            int u = queue.poll();
            System.out.print(u + " ");
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    queue.add(v);
                }
            }
        }
        System.out.println();
    }

    private void DFSUtil(int u, boolean[] visited) {
        visited[u] = true;
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) DFSUtil(v, visited);
        }
    }

    public void DFS(int start) {
        boolean[] visited = new boolean[V];
        System.out.print("DFS Traversal: ");
        DFSUtil(start, visited);
        System.out.println();
    }

    public static void main(String[] args) {
        GraphBFSDFS g = new GraphBFSDFS(4);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 2);
        g.addEdge(2, 3);

        g.BFS(2);
        g.DFS(2);
    }
}`,
      python: `from collections import deque

class Graph:
    def __init__(self, v):
        self.v = v
        self.adj = {i: [] for i in range(v)}

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)

    def bfs(self, start):
        visited = [False] * self.v
        queue = deque([start])
        visited[start] = True
        res = []

        while queue:
            u = queue.popleft()
            res.append(str(u))
            for v in self.adj[u]:
                if not visited[v]:
                    visited[v] = True
                    queue.append(v)
        print("BFS Traversal:", " ".join(res))

    def dfs(self, start):
        visited = [False] * self.v
        res = []

        def dfs_util(u):
            visited[u] = True
            res.append(str(u))
            for v in self.adj[u]:
                if not visited[v]:
                    dfs_util(v)

        dfs_util(start)
        print("DFS Traversal:", " ".join(res))

# Driver Code
g = Graph(4)
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 2)
g.add_edge(2, 3)

g.bfs(2)
g.dfs(2)`
    }
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRACTICALS_DATA };
}

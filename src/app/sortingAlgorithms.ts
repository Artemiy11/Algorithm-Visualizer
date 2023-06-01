function mergeSort(array: number[]) {
  const iterations: number[][] = [];
  const dots: number[][] = [];

  function merge(A: number[], l: number, mid: number, h: number) {
    let i = l;
    let j = mid + 1;
    let k = l;
    let B = [];

    while (i <= mid && j <= h) {
      if (A[i] < A[j]) {
        B[k] = A[i];
        dots.push([i, j]);
        k++;
        i++;
      } else {
        B[k] = A[j];
        dots.push([j, i]);
        k++;
        j++;
      }
      iterations.push(A.slice()); // Сохраняем промежуточный массив
    }

    while (i <= mid) {
      B[k++] = A[i++];
    }

    while (j <= h) {
      B[k++] = A[j++];
    }

    for (let i = l; i <= h; i++) {
      A[i] = B[i];
    }
  }

  function mergeSortHelper(A: number[], l: number, h: number) {
    if (l < h) {
      const mid = Math.floor((l + h) / 2);
      mergeSortHelper(A, l, mid);
      mergeSortHelper(A, mid + 1, h);
      merge(A, l, mid, h);

      iterations.push(A.slice()); // Сохраняем текущую итерацию
      dots.push([0, 0]);
    }
  }

  mergeSortHelper(array, 0, array.length - 1);
  return { iterations, dots };
}

function bubbleSort(array: number[]) {
  const iterations: number[][] = [];
  const dots: number[][] = [];

  for (let i = 0; i < array.length; i++) {
    for (let j = 1; j < array.length; j++) {
      if (array[j] < array[j - 1]) {
        [array[j], array[j - 1]] = [array[j - 1], array[j]];
        iterations.push(array.slice());
        dots.push([j - 1, j]);
      }
    }
  }

  return {iterations, dots};
}

function quickSort(arr: number[]) {
  const iterations: number[][] = [];
  const dots: number[][] = [];

  function quickSortHelper(items: number[], left: number, right: number) {
    let index;

    if (items.length > 1) {
      index = partition(items, left, right);

      if (left < index - 1) {
        quickSortHelper(items, left, index - 1);
      }

      if (right > index) {
        quickSortHelper(items, index, right);
      }
    }

    return items;
  }

  function partition(arr: number[], left: number, right: number) {
    let i = left,
      j = right;
    const pivot = arr[Math.floor((right + left) / 2)];

    while (i <= j) {
      while (arr[i] < pivot) {
        i++;
      }

      while (arr[j] > pivot) {
        j--;
      }

      if (i <= j) {
        swap(arr, i, j);
        iterations.push([...arr]);
        dots.push([i, j]);
        i++;
        j--;
      }
    }

    return i;
  }

  function swap(arr: number[], left: number, right: number) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
  }

  quickSortHelper(arr, 0, arr.length - 1);
  return {iterations, dots};
}

function heapSort(arr: number[]) {
  const iterations: number[][] = [];
  const dots: number[][] = [];

  function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    iterations.push([...arr]);
    dots.push([i, j]);
  }

  function siftDown(arr: number[], i: number, upper: number): void {
    while (true) {
      const l = i * 2 + 1,
        r = i * 2 + 2;
      if (Math.max(l, r) < upper) {
        // we have 2 children
        if (arr[i] >= Math.max(arr[l], arr[r])) {
          break;
        }
        if (arr[l] > arr[r]) {
          swap(arr, i, l);
          i = l;
        } else {
          swap(arr, i, r);
          i = r;
        }
      } else if (l < upper) {
        // only have left child
        if (arr[l] > arr[i]) {
          swap(arr, i, l);
          i = l;
        } else {
          break;
        }
      } else if (r < upper) {
        // only have right child
        if (arr[r] > arr[i]) {
          swap(arr, i, r);
          i = r;
        } else {
          break;
        }
      } else {
        // we don't have children
        break;
      }
    }
  }

  function heapSortHelper(lst: number[]): void {
    for (let j = Math.floor((lst.length - 2) / 2); j >= 0; j--) {
      siftDown(lst, j, lst.length);
    }

    for (let end = lst.length - 1; end > 0; end--) {
      swap(lst, 0, end);
      siftDown(lst, 0, end);
    }
  }

  heapSortHelper(arr);

  return {iterations, dots};
}

export { mergeSort, bubbleSort, quickSort, heapSort };

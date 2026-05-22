const focusInput = input => {
    input.focus();
    const length = input.value.length;
    input.setSelectionRange(length, length);
}

export { focusInput };
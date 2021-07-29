function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return '0 bytes';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export function upload(selector, options = {}) {
    let files = [];
    const input = document.querySelector(selector);

    const preview = document.createElement('div');
    preview.classList.add('preview');


    const openButton = document.createElement('button');
    openButton.classList.add('btn');
    openButton.textContent = 'Открыть';

    if (options.multi) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', openButton);

    const triggerInput = () => input.click();

    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);

        preview.innerHTML = '';
        files.forEach(file => {
            if (!file.type.match('image')) {
                return;
            }

            const reader = new FileReader();

            reader.onload = ev => {
                preview.insertAdjacentHTML('afterbegin',
                    `<div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${ev.target.result}"/>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            <span>${bytesToSize(file.size)}</span>
                        </div>
                    </div>`
                );
            }

            reader.readAsDataURL(file);
        });

    }

    const removeHandler = (event) => {
        if (!event.target.dataset.name) {
            return
        }

        const { name } = event.target.dataset;
        files = files.filter(file => file.name !== name);

        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');
        block.classList.add('removing');
        setTimeout(() => block.remove(), 300);
    }

    openButton.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
}
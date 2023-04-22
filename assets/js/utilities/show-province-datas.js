/**
 * 
 * @param {string} id 
 * @param {Array} provinces 
 */
export const showProvinceDatas = (id, provinces) => {
    const province = provinces.find(x => x.id === id);
    const div = document.createElement('div');
    div.style.width = '40%';
    div.className = 'table-data bg-white px-4 py-4';
    div.style.position = 'absolute';
    div.style.bottom = '20px';
    div.style.right = '20px';
    document.body.appendChild(div);
    div.innerHTML = `
    <h4>Données de la province</div>
    <form>
        <table class="table table-bordered">
            <thead>
                <tr>    
                    <th scope="col fs-5">#</th>
                    <th scope="col fs-5">Zone</th>
                    <th scope="col fs-5">Habitants</th>
                    <th scope="col fs-5">Grossesses</th>
                    <th scope="col fs-5">Hopitaux</th>
                    <th scope="col fs-5"></th>
                </tr>
            </thead>
            <tbody class="province-tab">
            </tbody>
        </table>
    </form>
    `;
    let tableBody = '';
    for(const zone of province.zones) {
        let checked = '';
        if (zone.id === 1) {
            checked = 'checked';
        }
        tableBody += `
        <tr>
            <th scope="row" class="fs-5">${zone.id}</th>
            <td class="fs-6">${zone.name}</td>
            <td class="fs-6">${zone.population}</td>
            <td class="fs-6">${zone.pregnancies}</td>
            <td class="fs-6">${zone.hospitals}</td>
            <td class="fs-6">
                <input type="radio" name="zone" ${checked}>
            </td>
        </tr>
        `;
    }
    const tbody = document.querySelector('.province-tab');
    tbody.innerHTML = tableBody;
}
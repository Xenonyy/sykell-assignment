USE sykell;

CREATE TABLE url_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    html_version VARCHAR(20),
    title VARCHAR(255),
    headings TEXT,
    internal_links INT,
    external_links INT,
    broken_links TEXT,
    has_login_form BOOLEAN
);
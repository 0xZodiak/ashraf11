import re

with open('C:\\Users\\Hamza\\Downloads\\Ashraf\\umrah.html', 'r', encoding='utf-8') as f:
    content = f.read()

with open('C:\\Users\\Hamza\\Downloads\\Ashraf\\new_section.html', 'r', encoding='utf-8') as f:
    new_section = f.read()

# Replace everything from <section class="section with-bg"> up to <!-- Footer -->
start_str = "    <!-- Main Content -->\n"
end_str = "    <!-- Footer -->\n"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx + len(start_str)] + new_section + "\n" + content[end_idx:]
    with open('C:\\Users\\Hamza\\Downloads\\Ashraf\\umrah.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Could not find start or end strings.")

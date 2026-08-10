insert into storage.buckets (id, name, public)
values ('public_images', 'public_images', true)
on conflict (id) do nothing;

create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'public_images' );

create policy "Admin Insert"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'public_images' );

create policy "Admin Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'public_images' );

create policy "Admin Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'public_images' );
